import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/registerUser.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema.js';
import { LoginUserdto } from '../auth/dto/loginUser.dto.js';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModal: Model<User>){}

    async createUser(registerUserdto:RegisterUserDto){
       try {
         return await this.userModal.create({
            First_name: registerUserdto.first_name,
            Last_name:  registerUserdto.last_name,
            Email: registerUserdto.email,
            Password: registerUserdto.password
        })
       } catch (error) {
        const DUPLICATE_KEY_ERROR = 11000;
        if((error as any)?.code == DUPLICATE_KEY_ERROR){
            throw new ConflictException("User already exist")
        }
        else{
            throw error as Error;
        }
       }
    }

    async findUserByEmail(loginUserDto:LoginUserdto){
        try {
            return await this.userModal.findOne({ Email: loginUserDto.email }).exec();
        } catch (error) {
            throw error as Error;
        }
    }
}
