import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ShiftService } from '../shift/shift.service';
import { CounterService } from '../counter/counter.service';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly shiftService: ShiftService,
        private readonly counterService: CounterService,
    ) { }

    /**
    * Validate username + password (or PIN). Returns user if ok, otherwise throws.
    */
    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // password stored as bcrypt hash (both admin password and cashier 6-digit PIN hashed)
        const matches = await bcrypt.compare(password, user.password_hash);
        if (!matches) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(user: any, counter_code?: string) {

        // common payload
        const payload = { username: user.username, sub: user.user_id, role: user.role };

        if (user.role === UserRole.CASHIER) {
            // counter_code required for cashier
            if (!counter_code) {
                throw new BadRequestException('counter_code is required for cashier login');
            }

            // find counter by code
            const counter = await this.counterService.findByCode(counter_code);
            if (!counter) {
                throw new NotFoundException(`Counter with code ${counter_code} not found`);
            }

            // ensure counter not already assigned
            if (counter.current_user) {
                throw new ConflictException(`Counter ${counter_code} is already in use`);
            }

            // start shift and assign counter to cashier
            const shift = await this.shiftService.startShiftForCashier(user.user_id, counter); // auto start shift

            const token = this.jwtService.sign(payload);
            return {
                access_token: token,
                role: user.role,
                shift: {
                    shift_id: shift.shift_id,
                    shift_start: shift.shift_start,
                    status: shift.status,
                },
            };
        }

        // Admin login (SUPER_ADMIN or SHOP_ADMIN)
        const token = this.jwtService.sign(payload);
        return { access_token: token, role: user.role };

    }

    async logout(user: { user_id: number; role: string }) {
        if (user.role === UserRole.CASHIER) {
            // end shift and free counter
            await this.shiftService.endShiftForCashier(user.user_id);
        }
        return { message: 'Logged out successfully' };
    }

    async getMe(userId: number) {
        const user = await this.userService.findOne(userId);
        if (!user) return null;

        // Optionally exclude password_hash
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
}
