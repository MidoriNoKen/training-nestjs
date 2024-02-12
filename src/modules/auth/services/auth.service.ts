import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'modules/user/services/user.service';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from '../entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../dtos/login.dto';
import { LoginInterface } from 'interfaces/login.interface';
import { RefreshAccessTokenDto } from '../dtos/refresh-access-token.dto';
import { RefreshTokenInterface } from 'interfaces/refresh-token.interface';
import { User } from 'modules/user/entities/user.entity';
import { refreshTokenConfig } from 'config/jwt.config';
import { CreateUserDto } from 'modules/user/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginInterface> {
    const { username, password } = loginDto;
    const user = await this.userService.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Invalid username or password');

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user),
    ]);

    return { user, accessToken, refreshToken };
  }

  async refreshAccessToken(
    refreshAccessTokenDto: RefreshAccessTokenDto,
  ): Promise<RefreshTokenInterface> {
    const { refresh_token } = refreshAccessTokenDto;
    const payload = await this.decodeToken(refresh_token);
    const refreshToken = await this.refreshTokenService.getDetailRefreshToken(
      payload.id,
    );

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is not found!');
    }

    if (refreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token is revoked!');
    }

    const accessToken = await this.createAccessToken(refreshToken.user);

    return { accessToken };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token is expired!');
      } else {
        throw new InternalServerErrorException('Failed to decode token!');
      }
    }
  }

  async createAccessToken(user: User): Promise<string> {
    return this.jwtService.signAsync({ userId: user.id });
  }

  async createRefreshToken(user: User): Promise<string> {
    const createRefreshToken =
      await this.refreshTokenService.createRefreshToken(
        user,
        +refreshTokenConfig.expiresIn,
      );
    const payload = { jid: createRefreshToken.id };
    return this.jwtService.signAsync(payload, refreshTokenConfig);
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }
}
