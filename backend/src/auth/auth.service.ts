import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UserRole,
  type User,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { TelegramInitDataService } from './telegram-init-data.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramInitDataService:
      TelegramInitDataService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticateTelegram(initData: string) {
    const validatedData =
      this.telegramInitDataService.validate(initData);

    const telegramUser = validatedData.user;
    const telegramId = String(telegramUser.id);

    const ownerTelegramId =
      process.env.TELEGRAM_OWNER_ID?.trim();

    const shouldBeOwner =
      Boolean(ownerTelegramId) &&
      telegramId === ownerTelegramId;

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          telegramId,
        },
      });

    const user = await this.prisma.user.upsert({
      where: {
        telegramId,
      },

      create: {
        telegramId,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || null,
        username: telegramUser.username || null,
        photoUrl: telegramUser.photo_url || null,
        languageCode:
          telegramUser.language_code || null,
        isPremium:
          telegramUser.is_premium === true,
        role: shouldBeOwner
          ? UserRole.OWNER
          : UserRole.USER,
        lastLoginAt: new Date(),
      },

      update: {
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || null,
        username: telegramUser.username || null,
        photoUrl: telegramUser.photo_url || null,
        languageCode:
          telegramUser.language_code || null,
        isPremium:
          telegramUser.is_premium === true,
        lastLoginAt: new Date(),

        ...(shouldBeOwner &&
        existingUser?.role !== UserRole.OWNER
          ? {
              role: UserRole.OWNER,
            }
          : {}),
      },
    });

    const expiresIn =
      this.getJwtExpiresInSeconds();

    const payload: JwtPayload = {
      sub: user.id,
      telegramId: user.telegramId,
      role: user.role,
    };

    const accessToken =
      await this.jwtService.signAsync(payload, {
        expiresIn,
      });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      user: this.serializeUser(user),
    };
  }

  serializeUser(user: User) {
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

  private getJwtExpiresInSeconds(): number {
    const configuredValue = Number(
      process.env.JWT_EXPIRES_IN_SECONDS,
    );

    if (
      process.env.JWT_EXPIRES_IN_SECONDS &&
      (
        !Number.isInteger(configuredValue) ||
        configuredValue <= 0
      )
    ) {
      throw new InternalServerErrorException(
        'JWT_EXPIRES_IN_SECONDS must be a positive integer',
      );
    }

    return configuredValue || 604800;
  }
}
