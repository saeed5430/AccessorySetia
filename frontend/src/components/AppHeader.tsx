import { lazy, Suspense } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const GemSpinner = lazy(() =>
  import("@/components/GemSpinner").then((m) => ({ default: m.GemSpinner })),
)

type AppHeaderProps = {
  firstName: string
  lastName: string
}

function AppHeader({ firstName, lastName }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="mx-auto grid w-full max-w-lg grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-4">
        <Avatar size="lg" className="justify-self-center">
          <AvatarFallback className="text-base font-medium">
            {firstName.charAt(0)}
            {"‌"}
            {lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <p className="truncate text-center text-sm font-medium">
          سلام {firstName} {lastName}
        </p>
        <div className="flex justify-center">
          <Suspense fallback={<div className="size-10" aria-hidden="true" />}>
            <GemSpinner />
          </Suspense>
        </div>
      </div>
    </header>
  )
}

export { AppHeader }
