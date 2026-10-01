import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { refreshAccessToken, setAccessToken } from "@/services/api"
import { getMe, login, saveProfile } from "@/services/auth"
import {
  getDevUser,
  getInitData,
  getMessengerUser,
  getPlatform,
  readyPlatform,
} from "@/services/Platform"
import type { AccountUser, AppUser, Platform, ProfilePayload } from "@/types/account"

type AuthStatus = "loading" | "ready" | "error"

type ProfileResult =
  | { success: true }
  | {
      success: false
      fieldErrors?: Partial<Record<keyof ProfilePayload, string>>
      message?: string
    }

type AppContextType = {
  platform: Platform
  messengerUser: AppUser | null
  user: AccountUser | null
  isProfileCompleted: boolean
  authStatus: AuthStatus
  authError: string | null
  isAuthenticated: boolean
  updateProfile: (payload: ProfilePayload) => Promise<ProfileResult>
  refreshUser: () => Promise<void>
  retry: () => void
}

const DEV_MOCK_USER: AccountUser = {
  id: "00000000-0000-4000-a000-000000000000",
  platform: "telegram",
  platform_user_id: "1",
  username: "developer",
  first_name: "سعید",
  last_name: "توسعه",
  avatar_url: "https://i.pravatar.cc/300",
  mobile_number: "09123456789",
  address: "تهران (نمونه)",
  postal_code: null,
  is_profile_completed: true,
  is_active: true,
  created_at: new Date().toISOString(),
  created_at_jalali: "-",
  updated_at: new Date().toISOString(),
  updated_at_jalali: "-",
}

const AppContext = createContext<AppContextType | null>(null)

type AppProviderProps = {
  children: ReactNode
}

function toApiError(error: unknown): { status: number | null; data: unknown } {
  if (error && typeof error === "object") {
    return {
      status: "status" in error ? (error as { status: number }).status : null,
      data: "data" in error ? (error as { data: unknown }).data : null,
    }
  }
  return { status: null, data: null }
}

function toFieldErrors(
  data: unknown,
): Partial<Record<keyof ProfilePayload, string>> | null {
  if (!data || typeof data !== "object") {
    return null
  }

  const fieldErrors: Partial<Record<keyof ProfilePayload, string>> = {}

  for (const [field, messages] of Object.entries(
    data as Record<string, unknown>,
  )) {
    if (Array.isArray(messages) && typeof messages[0] === "string") {
      fieldErrors[field as keyof ProfilePayload] = messages[0]
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null
}

function toMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const detail = (data as { detail?: unknown }).detail
    if (typeof detail === "string") {
      return detail
    }
    if (Array.isArray(detail) && typeof detail[0] === "string") {
      return detail[0]
    }
  }
  return "ذخیره اطلاعات ناموفق بود."
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<AccountUser | null>(null)
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading")
  const [authError, setAuthError] = useState<string | null>(null)

  const platform = useMemo(() => getPlatform(), [])
  const isDev = platform === "web"

  const messengerUser = useMemo(
    () => (isDev ? getDevUser() : getMessengerUser()),
    [isDev],
  )

  const isProfileCompleted = isDev
    ? true
    : (user?.is_profile_completed ?? false)

  const init = useCallback(async () => {
    if (isDev) {
      setAccessToken(null)
      setUser(DEV_MOCK_USER)
      setAuthStatus("ready")
      return
    }

    readyPlatform(platform)

    const initData = getInitData(platform)
    if (!initData) {
      setAuthError("اطلاعات ورود یافت نشد.")
      setAuthStatus("error")
      return
    }

    setAuthStatus("loading")
    setAuthError(null)

    const restoredAccess = await refreshAccessToken()
    if (restoredAccess) {
      try {
        const me = await getMe()
        setUser(me)
        setAuthStatus("ready")
        return
      } catch {
        setAccessToken(null)
      }
    }

    try {
      const response = await login(platform, initData)
      setAccessToken(response.access_token)
      setUser(response.user)
      setAuthStatus("ready")
    } catch (error) {
      const { data } = toApiError(error)
      setAuthError(toMessage(data))
      setAuthStatus("error")
    }
  }, [isDev, platform])

  useEffect(() => {
    void init()
  }, [init])

  const refreshUser = useCallback(async () => {
    if (isDev) {
      setUser(DEV_MOCK_USER)
      return
    }

    try {
      const me = await getMe()
      setUser(me)
    } catch (error) {
      const { data } = toApiError(error)
      setAuthError(toMessage(data))
      setAuthStatus("error")
    }
  }, [isDev])

  const updateProfile = useCallback(
    async (payload: ProfilePayload): Promise<ProfileResult> => {
      if (isDev) {
        setUser((previous) => {
          const base = previous ?? DEV_MOCK_USER
          return {
            ...base,
            first_name: payload.first_name,
            last_name: payload.last_name,
            mobile_number: payload.mobile_number,
            address: payload.address,
            postal_code: payload.postal_code ?? null,
            is_profile_completed: true,
          }
        })
        return { success: true }
      }

      try {
        const updated = await saveProfile(payload)
        setUser(updated)
        return { success: true }
      } catch (error) {
        const { status, data } = toApiError(error)
        if (status === 400) {
          const fieldErrors = toFieldErrors(data)
          if (fieldErrors) {
            return { success: false, fieldErrors }
          }
        }
        return { success: false, message: toMessage(data) }
      }
    },
    [isDev],
  )

  const retry = useCallback(() => {
    void init()
  }, [init])

  const value = useMemo<AppContextType>(
    () => ({
      platform,
      messengerUser,
      user,
      isProfileCompleted,
      authStatus,
      authError,
      isAuthenticated: Boolean(user),
      updateProfile,
      refreshUser,
      retry,
    }),
    [
      authError,
      authStatus,
      isProfileCompleted,
      messengerUser,
      platform,
      refreshUser,
      retry,
      updateProfile,
      user,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function useApp() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("useApp must be used inside AppProvider")
  }

  return context
}

export { AppProvider, useApp }
