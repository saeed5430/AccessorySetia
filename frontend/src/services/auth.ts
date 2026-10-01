import { apiRequest, refreshAccessToken, setAccessToken } from "./api"
import type {
  AccountUser,
  LoginResponse,
  Platform,
  ProfileFieldErrors,
  ProfilePayload,
} from "../types/account"

export const login = (
  platform: Platform,
  initData: string,
): Promise<LoginResponse> =>
  apiRequest<LoginResponse>("/login/", {
    method: "POST",
    body: { platform, init_data: initData },
    retry: false,
  })

export const getMe = (): Promise<AccountUser> =>
  apiRequest<AccountUser>("/me/")

export const saveProfile = (payload: ProfilePayload): Promise<AccountUser> =>
  apiRequest<AccountUser>("/profile/", { method: "PATCH", body: payload })

export const restoreSession = async (): Promise<AccountUser | null> => {
  const access = await refreshAccessToken()
  if (!access) {
    return null
  }
  return getMe()
}

export const logout = (): Promise<void> =>
  apiRequest<void>("/logout/", { method: "POST" }).then(() => {
    setAccessToken(null)
  })

export const extractFieldErrors = (data: unknown): ProfileFieldErrors => {
  if (!data || typeof data !== "object") {
    return {}
  }

  const errors: ProfileFieldErrors = {}

  for (const [field, messages] of Object.entries(
    data as Record<string, unknown>,
  )) {
    if (Array.isArray(messages) && typeof messages[0] === "string") {
      errors[field as keyof ProfilePayload] = messages[0]
    }
  }

  return errors
}

export const extractErrorMessage = (data: unknown): string | null => {
  if (!data || typeof data !== "object") {
    return null
  }

  const detail = (data as { detail?: unknown }).detail
  if (Array.isArray(detail) && typeof detail[0] === "string") {
    return detail[0]
  }
  if (typeof detail === "string") {
    return detail
  }

  return null
}
