import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';
import { User } from 'modules/user/entities/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(user: User, ttl: number): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({
        user,
        isRevoked: false,
        expiredAt: new Date(Date.now() + ttl),
      }),
    );
    return refreshToken;
  }

  async getDetailRefreshToken(id: number): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { id },
    });
    if (!refreshToken) {
      throw new NotFoundException('Data not found!');
    }
    return refreshToken;
  }

  async revokeRefreshToken(id: number): Promise<RefreshToken> {
    const refreshToken = await this.getDetailRefreshToken(id);
    refreshToken.isRevoked = true;
    return this.refreshTokenRepository.save(refreshToken);
  }
}
