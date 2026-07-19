export type UserRole =
  | 'USER'
  | 'ADMIN'
  | 'OWNER';

export interface AuthUser {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  photoUrl: string | null;
  languageCode: string | null;
  isPremium: boolean;
  role: UserRole;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TelegramAuthResponse {
  accessToken: string;
  tokenType: 'Bearer' | string;
  expiresIn: number;
  user: AuthUser;
}

export interface CurrentUserResponse {
  user: AuthUser;
}
