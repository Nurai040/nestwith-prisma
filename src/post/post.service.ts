import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(data) {
    return await this.prisma.post.create({
      data,
    });
  }

  async getPosts() {
    return await this.prisma.post.findMany();
  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return post;
  }

  async updatePostById(id: number, data) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.post.update({
      data,
      where: {
        id,
      },
    });
  }

  async deleteById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.post.delete({
      where: {
        id,
      },
    });

    return 'The post successfully deleted!';
  }

  async getAuthor(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    return post.userId;
  }
}
