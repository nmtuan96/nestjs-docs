import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthoCredenticalDto } from './dto/AuthCredenticalsDto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Post('/signup')
    signUp(@Body() authCredenticalDto: AuthoCredenticalDto): Promise<User> {
        return this.authService.createUser(authCredenticalDto);
    }

    @Post('/signin')
    signIn(@Body() authCredenticalDto: AuthoCredenticalDto): Promise<{accessToken: string}> {
        return this.authService.signin(authCredenticalDto);
    }

    @Post('test')
    @UseGuards(AuthGuard())
    test(@Req() req) {
        console.log(req);
    }
}
