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
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { JwtGuard } from 'guards/jwt.guards';
import { ResponseInterface } from 'interfaces/response.interface';
import { User } from '../entities/user.entity';
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ResponseInterface<User[]>> {
    const data = await this.userService.findAll();
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ResponseInterface<User>> {
    const data = await this.userService.findOne(id);
    return { data };
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseInterface<User>> {
    const data = await this.userService.create(createUserDto);
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseInterface<User>> {
    const data = await this.userService.update(id, updateUserDto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ResponseInterface<User>> {
    const data = await this.userService.remove(id);
    return { data };
  }
}
