import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ShiftService } from '../shift/shift.service';
import { CounterService } from '../counter/counter.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly shiftService: ShiftService,
        private readonly counterService: CounterService,
    ) { }

    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username);
        if (user && (await bcrypt.compare(password, user.password_hash))) {
            return user;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: any, counter_code?: string) {

            const payload = { username: user.username, sub: user.user_id, role: user.role };

            if (user.role === 'cashier') {
                const counter = await this.counterService.findByCode(counter_code as string);

                if (!counter) {
                    throw new NotFoundException(`Counter with code ${counter_code} not found`);
                }

                if (counter.current_user) {
                    throw new UnauthorizedException(`Counter ${counter_code} is already in use`);
                }

                await this.shiftService.startShiftForCashier(user.user_id, counter); // auto start shift
            }

            return {
                access_token: this.jwtService.sign(payload),
                role: user.role,
            };
        
    }

    async logout(user: any) {
        if (user.role === 'cashier') {
            console.log('Logout request user:', user);
            await this.shiftService.endShiftForCashier(user.user_id); // auto end shift
        }
        return { message: 'Logged out successfully' };
    }
}
