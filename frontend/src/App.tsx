import { useEffect } from "react"
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Home from "@/pages/Home"
import Profile from "@/pages/Profile"
import { useApp } from "@/contexts/AppContext"

const AuthLoading = () => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background text-foreground">
    <div
      className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
      aria-hidden="true"
    />
    <p className="text-sm text-muted-foreground">در حال ورود...</p>
  </div>
)

const AuthError = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
    <p className="text-sm font-medium">{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
    >
      تلاش مجدد
    </button>
  </div>
)

function Guards({ children }: { children: React.ReactNode }) {
  const { authStatus, authError, isProfileCompleted, retry } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (
      authStatus === "ready" &&
      !isProfileCompleted &&
      location.pathname !== "/profile"
    ) {
      navigate("/profile", { replace: true })
    }
  }, [authStatus, isProfileCompleted, location.pathname, navigate])

  if (authStatus === "loading") {
    return <AuthLoading />
  }

  if (authStatus === "error") {
    return <AuthError message={authError ?? "خطایی رخ داد."} onRetry={retry} />
  }

  if (!isProfileCompleted && location.pathname !== "/profile") {
    return <AuthLoading />
  }

  return <>{children}</>
}

function App() {
  return (
    <Guards>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Guards>
  )
}

export default App
