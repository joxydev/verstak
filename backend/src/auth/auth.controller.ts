import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  CurrentUser,
} from './decorators/current-user.decorator';
import { TelegramAuthDto } from './dto/telegram-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type {
  AuthenticatedUser,
} from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('telegram')
  @HttpCode(HttpStatus.OK)
  authenticateTelegram(
    @Body() dto: TelegramAuthDto,
  ) {
    return this.authService.authenticateTelegram(
      dto.initData,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(
    @CurrentUser() user:
      | AuthenticatedUser
      | undefined,
  ) {
    if (!user) {
      throw new UnauthorizedException(
        'Authenticated user is missing',
      );
    }

    return {
      user,
    };
  }
}
