import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { username: string; password: string; counter_code?: string }) {
        const user = await this.authService.validateUser(body.username, body.password);
        return this.authService.login(user, body.counter_code);
    }

    // @UseGuards(JwtAuthGuard)
    // @Post('logout')
    // async logout(@Request() req) {
    //     console.log('REQ.USER:', req.user);
    //     return this.authService.logout(req.user);
    // }
}
