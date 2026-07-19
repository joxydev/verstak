import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  createHmac,
  timingSafeEqual,
} from 'node:crypto';

import type {
  TelegramWebAppUser,
  ValidatedTelegramInitData,
} from './interfaces/telegram-user.interface';

@Injectable()
export class TelegramInitDataService {
  validate(initData: string): ValidatedTelegramInitData {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      throw new InternalServerErrorException(
        'TELEGRAM_BOT_TOKEN is not configured',
      );
    }

    if (!initData?.trim()) {
      throw new UnauthorizedException(
        'Telegram initData is missing',
      );
    }

    const params = new URLSearchParams(initData);
    const receivedHash = params.get('hash');

    if (!receivedHash) {
      throw new UnauthorizedException(
        'Telegram hash is missing',
      );
    }

    const dataCheckString = Array.from(params.entries())
      .filter(([key]) => key !== 'hash')
      .sort(([firstKey], [secondKey]) =>
        firstKey.localeCompare(secondKey),
      )
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = createHmac(
      'sha256',
      'WebAppData',
    )
      .update(botToken)
      .digest();

    const calculatedHash = createHmac(
      'sha256',
      secretKey,
    )
      .update(dataCheckString)
      .digest('hex');

    const receivedHashBuffer = Buffer.from(
      receivedHash,
      'hex',
    );

    const calculatedHashBuffer = Buffer.from(
      calculatedHash,
      'hex',
    );

    const hasValidHash =
      receivedHashBuffer.length ===
        calculatedHashBuffer.length &&
      timingSafeEqual(
        receivedHashBuffer,
        calculatedHashBuffer,
      );

    if (!hasValidHash) {
      throw new UnauthorizedException(
        'Telegram initData signature is invalid',
      );
    }

    const authDateRaw = params.get('auth_date');
    const authDate = Number(authDateRaw);

    if (
      !authDateRaw ||
      !Number.isInteger(authDate) ||
      authDate <= 0
    ) {
      throw new UnauthorizedException(
        'Telegram auth_date is invalid',
      );
    }

    this.validateAuthDate(authDate);

    const userRaw = params.get('user');

    if (!userRaw) {
      throw new UnauthorizedException(
        'Telegram user data is missing',
      );
    }

    const user = this.parseUser(userRaw);

    return {
      user,
      authDate,
      queryId: params.get('query_id') ?? undefined,
      startParam: params.get('start_param') ?? undefined,
    };
  }

  private validateAuthDate(authDate: number): void {
    const configuredMaxAge = Number(
      process.env.TELEGRAM_AUTH_MAX_AGE_SECONDS,
    );

    const maxAgeSeconds =
      Number.isFinite(configuredMaxAge) &&
      configuredMaxAge > 0
        ? configuredMaxAge
        : 86400;

    const currentTimestamp = Math.floor(
      Date.now() / 1000,
    );

    const ageSeconds = currentTimestamp - authDate;

    if (ageSeconds < -60) {
      throw new UnauthorizedException(
        'Telegram auth_date is in the future',
      );
    }

    if (ageSeconds > maxAgeSeconds) {
      throw new UnauthorizedException(
        'Telegram initData has expired',
      );
    }
  }

  private parseUser(
    userRaw: string,
  ): TelegramWebAppUser {
    let parsedUser: unknown;

    try {
      parsedUser = JSON.parse(userRaw);
    } catch {
      throw new UnauthorizedException(
        'Telegram user data is not valid JSON',
      );
    }

    if (
      !parsedUser ||
      typeof parsedUser !== 'object'
    ) {
      throw new UnauthorizedException(
        'Telegram user data is invalid',
      );
    }

    const user = parsedUser as Partial<TelegramWebAppUser>;

    if (
      typeof user.id !== 'number' ||
      !Number.isSafeInteger(user.id) ||
      user.id <= 0
    ) {
      throw new UnauthorizedException(
        'Telegram user ID is invalid',
      );
    }

    if (
      typeof user.first_name !== 'string' ||
      !user.first_name.trim()
    ) {
      throw new UnauthorizedException(
        'Telegram first name is invalid',
      );
    }

    return {
      id: user.id,
      is_bot: user.is_bot,
      first_name: user.first_name.trim(),
      last_name:
        typeof user.last_name === 'string'
          ? user.last_name.trim()
          : undefined,
      username:
        typeof user.username === 'string'
          ? user.username.trim()
          : undefined,
      language_code:
        typeof user.language_code === 'string'
          ? user.language_code.trim()
          : undefined,
      is_premium: user.is_premium === true,
      photo_url:
        typeof user.photo_url === 'string'
          ? user.photo_url
          : undefined,
    };
  }
}
