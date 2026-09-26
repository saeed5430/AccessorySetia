import { getTelegramUser } from "./telegram";
import { getBaleUser } from "./bale";

export const getPlatform = () => {
  if (window.Telegram?.WebApp) {
    return "telegram";
  }

  if ((window as any).Bale?.WebApp) {
    return "bale";
  }

  return "web";
};

export const getUser = () => {
  const platform = getPlatform();

  if (platform === "telegram") {
    return getTelegramUser();
  }

  if (platform === "bale") {
    return getBaleUser();
  }

  return {
    id: 1,
    first_name: "سعید",
    username: "developer",
    photo_url: "https://i.pravatar.cc/300",
  };
};