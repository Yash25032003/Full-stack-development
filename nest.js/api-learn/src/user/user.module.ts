import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema.js';

@Module({
  imports:[
    MongooseModule.forFeature([{name : User.name , schema : UserSchema}])
  ],
  providers: [UserService],
  // exporting userservice taaki isse hum dusre modules me bhi use kar paye.
  exports:[UserService]
})
export class UserModule {}
