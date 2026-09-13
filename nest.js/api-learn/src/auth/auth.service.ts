import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { RegisterUserDto } from './dto/registerUser.dto.js';
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly userService:UserService , 
        private readonly jwtService: JwtService
    ){}
    async registerUser(registerUserdto:RegisterUserDto){
        const saltRounds = 10;
        const hash = await bcrypt.hash(registerUserdto.password , saltRounds);
        // logic of register of user goes here
        // 1. check if email already exist or not
        // 2. Hash the password 
        // 3. Store the user in DB`
        // 4. Generate JWT Token
        const user = await this.userService.createUser({...registerUserdto , password:hash});

        const payload = {sub: user._id}
        const token = await this.jwtService.signAsync(payload)
        return {
            message:"User registered with token",
            accessToken: token
        }
       
    }
}
