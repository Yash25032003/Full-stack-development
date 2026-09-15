import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { RegisterUserDto } from './dto/registerUser.dto.js';
import bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { LoginUserdto } from './dto/loginUser.dto.js';

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

    async loginUser(loginUserdto:LoginUserdto){
        // 1. check if user exist with email
        const user = await this.userService.findUserByEmail(loginUserdto);
        if(!user){
            throw new UnauthorizedException("Invalid email entered")
        }
        // 2. compare password
        const IsPassword = await bcrypt.compare(
            loginUserdto.password,
            user.Password
        )
        if(!IsPassword){
            throw new UnauthorizedException("Invalid password")
        }
        // 3. generate token
        const payload = {sub: user._id , email: user.Email};
        const token = await this.jwtService.signAsync(payload);
        return {
            message: "User logged in successfully",
            accessToken: token
        }
    }
}
