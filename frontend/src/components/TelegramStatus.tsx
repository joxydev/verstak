import { useTelegram } from '../telegram/TelegramProvider';

export function TelegramStatus() {
  const {
    user,
    isTelegram,
    isReady,
  } = useTelegram();

  if (!isReady) {
    return null;
  }

  if (!isTelegram) {
    return (
      <span
        className="telegram-status telegram-status--browser"
        title="Приложение открыто в обычном браузере"
      >
        Web
      </span>
    );
  }

  const userName =
    user?.firstName ||
    user?.username ||
    'Telegram';

  return (
    <span
      className="telegram-status telegram-status--telegram"
      title={`Открыто в Telegram: ${userName}`}
    >
      {userName}
    </span>
  );
}
