import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role } from "../user.types.js";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User{
    @Prop({required:true})
    First_name : string;

    @Prop({required:true})
    Last_name : string;

    @Prop({required:true , unique:true})
    Email: string;

    @Prop({required:true})
    Password : string;

    @Prop({default:Role.Student})
    Role : string;
}

export const UserSchema = SchemaFactory.createForClass(User)