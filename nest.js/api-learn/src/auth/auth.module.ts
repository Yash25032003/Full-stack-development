import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserModule } from '../user/user.module.js';

@Module({
  // hamne import kar liya UserModule ko aur jo exported service hogi UserModule ki usse hum
  // auth module me use kar payenge.
  imports:[UserModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
