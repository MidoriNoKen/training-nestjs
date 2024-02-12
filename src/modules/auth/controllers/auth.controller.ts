import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { LoginDto } from '../dtos/login.dto';
import { ResponseInterface } from 'interfaces/response.interface';
import { LoginInterface } from 'interfaces/login.interface';
import { CreateUserDto } from 'modules/user/dtos/create-user.dto';
import { User } from 'modules/user/entities/user.entity';
import { RefreshAccessTokenDto } from '../dtos/refresh-access-token.dto';
import { RefreshTokenInterface } from 'interfaces/refresh-token.interface';
import { RefreshToken } from '../entities/refresh-token.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ResponseInterface<LoginInterface>> {
    const data = await this.authService.login(loginDto);
    return { data };
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseInterface<User>> {
    const data = await this.authService.register(createUserDto);
    return { data };
  }

  @Post('refresh-token')
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<ResponseInterface<RefreshTokenInterface>> {
    const data = await this.authService.refreshAccessToken(
      refreshAccessTokenDto,
    );
    return { data };
  }

  @Put('revoke-refresh-token/:id')
  async revokeRefreshToken(
    @Param('id') id: number,
  ): Promise<ResponseInterface<RefreshToken>> {
    const data = await this.refreshTokenService.revokeRefreshToken(id);
    return { data };
  }
}
