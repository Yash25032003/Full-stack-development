import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  // hamne import kar liya UserModule ko aur jo exported service hogi UserModule ki usse hum
  // auth module me use kar payenge.
  imports:[UserModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global:true,
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn:"60s"}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
