import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';


@Controller('auth')
export class AuthController {
    // dependency injection
    constructor (private readonly authService:AuthService){}
    
    // routes bana rahe hai for register
    @Post('register')
        register(){
            // service se register ka logic/function use kar rahe hai
           const response =  this.authService.registerUser();
           return response;
        }
}
