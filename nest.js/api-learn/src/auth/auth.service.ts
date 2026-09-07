import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    registerUser(){
        // logic of register of user goes here
        // 1. check if email already exist or not
        // 2. Hash the password 
        // 3. Store the user in DB
        // 4. Generate JWT Token

        return {message:"User has been registered from service"}
    }
}
