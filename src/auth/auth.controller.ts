import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.register(createUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error with register: ', error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('login')
  async login(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.login(createUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error with login: ', error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
