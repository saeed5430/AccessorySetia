import { lazy, Suspense } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const GemSpinner = lazy(() =>
  import("@/components/GemSpinner").then((m) => ({ default: m.GemSpinner })),
)

type AppHeaderProps = {
  firstName: string
  lastName: string
  avatarUrl?: string
}

function AppHeader({ firstName, lastName, avatarUrl }: AppHeaderProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto flex h-[84px] w-full max-w-lg items-center gap-3 px-4 pt-[env(safe-area-inset-top)]">
        <Avatar size="default" className="shrink-0 ring-2 ring-primary/20">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />}
          <AvatarFallback variant="primary" className="text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col items-center">
          <p className="truncate text-base font-semibold text-foreground">
            سلام {firstName} {lastName}
          </p>
          <p className="text-xs text-muted-foreground">فروشگاه ستیا</p>
        </div>

        <div className="shrink-0">
          <Suspense fallback={<div className="size-10" aria-hidden="true" />}>
            <GemSpinner />
          </Suspense>
        </div>
      </div>
    </header>
  )
}

export { AppHeader }