import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dtos/create-post.dto/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto/update-post.dto';
import { JwtGuard } from 'guards/jwt.guards';
import { ResponseInterface } from 'interfaces/response.interface';
import { Post as postData } from '../entities/post.entity';
@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(): Promise<ResponseInterface<postData[]>> {
    const data = await this.postService.findAll();
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ResponseInterface<postData>> {
    const data = await this.postService.findOne(id);
    return { data };
  }

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<ResponseInterface<postData>> {
    const data = await this.postService.create(createPostDto);
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<ResponseInterface<postData>> {
    const data = await this.postService.update(id, updatePostDto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ResponseInterface<postData>> {
    const data = await this.postService.remove(id);
    return { data };
  }
}
