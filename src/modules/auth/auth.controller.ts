import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /** 
   * Login endpoint.
   * - Admins (SUPER_ADMIN/SHOP_ADMIN): provide username + password
   * - Cashiers: provide username + 6-digit PIN as password + counter_code
   */

    @Post('login')
    async login(@Body() body: LoginDto) {
        // ValidationPipe will ensure username/password exist
        const user = await this.authService.validateUser(body.username, body.password);

        // If cashier, authService.login will validate counter_code presence
        return this.authService.login(user, body.counter_code);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@Req() req) {
        return this.authService.getMe(req.user.user_id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req) {
        // req.user comes from JwtStrategy.validate()
        return this.authService.logout(req.user);
    }
}
