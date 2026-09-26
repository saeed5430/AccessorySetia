import type { AppUser } from "../types/account";
import type {} from "telegram-web-app";

export const getTelegramUser = (): AppUser | null => {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    photo_url: user.photo_url,
  };
};

export const getTelegramInitData = (): string => {
  return window.Telegram?.WebApp?.initData ?? "";
};

export const readyTelegram = (): void => {
  window.Telegram?.WebApp?.ready();
};