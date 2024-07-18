import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async allUsers() {
    try {
      return await this.userService.getUsers();
    } catch (error) {
      console.error('Error with fetching the users: ', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'USER')
  async userById(@Param('id') id: string, @Req() request) {
    try {
      const reqUserId = +request.user.id;
      if (reqUserId !== +id && request.user.role !== 'ADMIN') {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return await this.userService.getUserById(parseInt(id));
    } catch (error) {
      console.error('Error with fetching the user by ID: ', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'USER')
  async updateById(
    @Param('id') id: string,
    @Body() createUserDto: CreateUserDto,
    @Req() request,
  ) {
    try {
      const reqUserId = +request.user.id;
      if (reqUserId !== +id && request.user.role !== 'ADMIN') {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      const updatedUser = await this.userService.updateUserById(
        parseInt(id),
        createUserDto,
      );
      return { message: 'user is updated successfully', user: updatedUser };
    } catch (error) {
      console.error('Error with updating the user by ID: ', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'USER')
  async deleteById(@Param('id') id: string, @Req() request) {
    try {
      const reqUserId = +request.user.id;
      if (reqUserId !== +id && request.user.role !== 'ADMIN') {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      await this.userService.deleteUserById(parseInt(id));
      return { message: 'user is deleted successfully' };
    } catch (error) {
      console.error('Error with deleting the user by ID: ', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
