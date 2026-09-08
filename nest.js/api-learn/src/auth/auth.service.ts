import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { RegisterUserDto } from './dto/registerUser.dto.js';
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(private readonly userService:UserService){}
    async registerUser(registerUserdto:RegisterUserDto){
        const saltRounds = 10;
        const hash = await bcrypt.hash(registerUserdto.password , saltRounds);
        // logic of register of user goes here
        // 1. check if email already exist or not
        // 2. Hash the password 
        // 3. Store the user in DB`
        // 4. Generate JWT Token
        return this.userService.createUser({...registerUserdto , password:hash})
    }
}
