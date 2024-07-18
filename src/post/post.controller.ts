import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { RolesGuard } from '../roles.guard';
import { Roles } from '../roles.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'USER')
  async createPost(@Body() createpostDto: CreatePostDto) {
    try {
      return await this.postService.createPost(createpostDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error with creating the post: ', error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get()
  async getPosts() {
    try {
      return await this.postService.getPosts();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error with fetching the posts: ', error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    try {
      return await this.postService.getPostById(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error with fetching the post by ID: ', error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'USER')
  async updatePostById(
    @Param('id') id: string,
    @Body() createpostDto: CreatePostDto,
    @Req() request,
  ) {
    try {
      const reqUserId = +request.user.id;
      const userId = await this.postService.getAuthor(+id);
      if (reqUserId !== +userId) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return await this.postService.updatePostById(parseInt(id), createpostDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error with updating the post by ID: ', error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'USER')
  async deletePostById(@Param('id') id: string, @Req() request) {
    try {
      const reqUserId = +request.user.id;
      const userId = await this.postService.getAuthor(+id);
      if (reqUserId !== +userId && request.user.role !== 'ADMIN') {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      return await this.postService.deleteById(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error with deleting the post by ID: ', error);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
