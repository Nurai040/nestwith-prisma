import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtauthModule } from '../jwtauth/jwtauth.module';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [JwtauthModule, PrismaModule],
  providers: [UserService],
  controllers: [AuthController],
})
export class AuthModule {}
