import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TelegramInitDataService } from './telegram-init-data.service';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    TelegramInitDataService,
  ],
  exports: [
    AuthService,
    TelegramInitDataService,
  ],
})
export class AuthModule {}
