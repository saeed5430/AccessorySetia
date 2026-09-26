import type { AppUser } from "../types/account";

export const getBaleUser = (): AppUser | null => {
  const user = (window as any).Bale?.WebApp?.user;

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

export const getBaleInitData = (): string => {
  return (window as any).Bale?.WebApp?.initData ?? "";
};

export const readyBale = (): void => {
  (window as any).Bale?.WebApp?.ready?.();
};