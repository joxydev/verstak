import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { PrismaService } from '../../prisma/prisma.service';
import type {
  AuthenticatedUser,
  JwtPayload,
} from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    const secret = process.env.JWT_SECRET?.trim();

    if (!secret) {
      throw new Error(
        'JWT_SECRET environment variable is not configured',
      );
    }

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<AuthenticatedUser> {
    if (
      !payload ||
      !Number.isInteger(payload.sub) ||
      payload.sub <= 0 ||
      !payload.telegramId
    ) {
      throw new UnauthorizedException(
        'JWT payload is invalid',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (
      !user ||
      user.telegramId !== payload.telegramId
    ) {
      throw new UnauthorizedException(
        'Authenticated user was not found',
      );
    }

    return {
      id: user.id,
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      languageCode: user.languageCode,
      isPremium: user.isPremium,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
