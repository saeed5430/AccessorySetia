export type Platform = "telegram" | "bale" | "web";

export interface AppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}