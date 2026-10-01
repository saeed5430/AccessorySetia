let accessToken: string | null = null

export const setAccessToken = (token: string | null): void => {
  accessToken = token
}

export const getAccessToken = (): string | null => accessToken

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown, message = "خطایی رخ داد") {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  retry?: boolean
}

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/account/token/refresh/", {
      method: "POST",
      credentials: "include",
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as { access?: string }
    if (!data.access) {
      return null
    }

    accessToken = data.access
    return data.access
  } catch {
    return null
  }
}

export { refreshAccessToken }

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { method = "GET", body, retry = true } = options
  const headers: Record<string, string> = {}

  if (body !== undefined) {
    headers["Content-Type"] = "application/json"
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  const response = await fetch(`/api/account${path}`, {
    method,
    headers,
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 401 && retry && accessToken) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return apiRequest<T>(path, { ...options, retry: false })
    }
  }

  const text = await response.text()
  const data = text ? (JSON.parse(text) as unknown) : null

  if (!response.ok) {
    throw new ApiError(response.status, data)
  }

  return data as T
}
