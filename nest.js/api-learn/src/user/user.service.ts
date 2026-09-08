import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/registerUser.dto.js';

@Injectable()
export class UserService {
    createUser(registerUserdto:RegisterUserDto){
        return {message :"User created successfully from service file" , registerUserdto}
    }
}
