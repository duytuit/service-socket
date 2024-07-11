import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.body);
    }

    @Post('register')
    async register(@Request() req) {
        return this.authService.register(req.body.username, req.body.password);
    }
}
