import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data) {
    const { email, password, role } = data;
    const curr = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (curr) {
      throw new HttpException(
        'User with this email already exists!',
        HttpStatus.NOT_FOUND,
      );
    }
    const hashPassword = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: {
        email,
        password: hashPassword,
        role,
      },
    });
  }

  async login(data) {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new HttpException('Incorrect password!', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async updateUserById(id: number, data) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    return await this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async deleteUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
