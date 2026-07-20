import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TelegramInitDataService } from './telegram-init-data.service';

@Module({
  imports: [
    PrismaModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),

    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET?.trim();

        if (!secret) {
          throw new Error('JWT_SECRET environment variable is not configured');
        }

        return {
          secret,
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    TelegramInitDataService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],

  exports: [
    AuthService,
    TelegramInitDataService,
    JwtModule,
    PassportModule,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
