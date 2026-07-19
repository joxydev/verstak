import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { TelegramInitDataService } from './telegram-init-data.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramInitDataService: TelegramInitDataService,
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

    return {
      user: {
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
      },
    };
  }
}
