export type Platform = "telegram" | "bale" | "web"

export interface AppUser {
  id: string | number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

export interface AccountUser {
  id: string
  platform: "telegram" | "bale"
  platform_user_id: string
  username: string | null
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  mobile_number: string | null
  address: string | null
  postal_code: string | null
  is_profile_completed: boolean
  is_active: boolean
  created_at: string
  created_at_jalali: string
  updated_at: string
  updated_at_jalali: string
}

export interface LoginResponse {
  access_token: string
  user: AccountUser
  is_profile_completed: boolean
}

export interface ProfilePayload {
  first_name: string
  last_name: string
  mobile_number: string
  address: string
  postal_code?: string | null
}

export type ProfileFieldErrors = Partial<Record<keyof ProfilePayload, string>>
