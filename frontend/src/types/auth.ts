export type UserRole = 'USER' | 'ADMIN' | 'OWNER';

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
  createdAt: string;
  updatedAt: string;
}

export interface TelegramAuthResponse {
  user: AuthUser;
}
