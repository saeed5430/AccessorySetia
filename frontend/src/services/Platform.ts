import { getBaleInitData, readyBale } from "./bale"
import { getTelegramInitData, getTelegramUser, readyTelegram } from "./telegram"
import type { AppUser, Platform } from "../types/account"

export { readyTelegram, readyBale }

export const getPlatform = (): Platform => {
  if (typeof window === "undefined") {
    return "web"
  }

  if (window.Telegram?.WebApp?.initData) {
    return "telegram"
  }

  if ((window as any).Bale?.WebApp?.initData) {
    return "bale"
  }

  return "web"
}

export const getInitData = (platform: Platform): string => {
  if (platform === "telegram") {
    return getTelegramInitData()
  }

  if (platform === "bale") {
    return getBaleInitData()
  }

  return ""
}

export const getMessengerUser = (): AppUser | null => {
  const platform = getPlatform()

  if (platform === "telegram") {
    return getTelegramUser()
  }

  if (platform === "bale") {
    const user = (window as any).Bale?.WebApp?.initDataUnsafe?.user
    if (!user) {
      return null
    }
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
    }
  }

  return null
}

export const getDevUser = (): AppUser => {
  return {
    id: 1,
    first_name: "سعید",
    username: "developer",
    photo_url: "https://i.pravatar.cc/300",
  }
}

export const readyPlatform = (platform: Platform): void => {
  if (platform === "telegram") {
    readyTelegram()
  } else if (platform === "bale") {
    readyBale()
  }
}
