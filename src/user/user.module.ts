import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtauthModule } from '../jwtauth/jwtauth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [JwtauthModule, PrismaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
