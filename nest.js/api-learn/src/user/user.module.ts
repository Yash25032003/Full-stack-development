import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';

@Module({
  providers: [UserService],
  // exporting userservice taaki isse hum dusre modules me bhi use kar paye.
  exports:[UserService]
})
export class UserModule {}
