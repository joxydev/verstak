import type { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: number;
  telegramId: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  photoUrl: string | null;
  languageCode: string | null;
  isPremium: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
