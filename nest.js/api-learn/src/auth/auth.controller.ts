import { Controller, Post ,Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterUserDto } from './dto/registerUser.dto.js';


@Controller('auth')
export class AuthController {
    // dependency injection
    constructor (private readonly authService:AuthService){}
    
    // routes bana rahe hai for register
    @Post('register')
        async register(@Body() registerUserdto:RegisterUserDto){
            // service se register ka logic/function use kar rahe hai
           const createdUser =  await this.authService.registerUser(registerUserdto);
           return createdUser;
        }
}
