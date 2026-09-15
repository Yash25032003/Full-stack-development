import {IsString , IsEmail} from "class-validator"

// validation ke saath handle kiya hai hamne dto ko 
export class RegisterUserDto{
    @IsString()
    first_name : string;

    @IsString()
    last_name : string;
    
    @IsEmail()
    email: string;

    @IsString()
    password:string;
}