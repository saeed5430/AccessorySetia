import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Code, MessageCircle, Send, type LucideIcon } from "lucide-react"
import type { AppUser, Platform } from "@/types/account"

const platformMeta: Record<Platform, { label: string; icon: LucideIcon }> = {
  telegram: { label: "تلگرام", icon: Send },
  bale: { label: "بله", icon: MessageCircle },
  web: { label: "حالت توسعه", icon: Code },
}

type ProfileIdentityProps = {
  user: AppUser | null
  platform: Platform
}

function ProfileIdentity({ user, platform }: ProfileIdentityProps) {
  const firstName = user?.first_name ?? ""
  const lastName = user?.last_name ?? ""
  const username = user?.username
  const meta = platformMeta[platform]
  const PlatformIcon = meta.icon
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`

  return (
    <section
      aria-label="حساب کاربری"
      className="flex flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-4 py-6 text-center shadow-setia"
    >
      <div className="rounded-full bg-setia-gem/10 p-1.5 ring-1 ring-setia-gem/30">
        <Avatar size="lg">
          <AvatarImage
            src={user?.photo_url}
            alt={firstName ? `${firstName} ${lastName}`.trim() : "آواتار کاربر"}
          />
          <AvatarFallback variant="primary" className="font-medium">
            {initials || "؟"}
          </AvatarFallback>
        </Avatar>
      </div>

      {username ? (
        <p dir="ltr" className="text-base font-semibold text-foreground">
          @{username}
        </p>
      ) : (
        <p className="text-sm font-medium text-muted-foreground">
          بدون نام کاربری
        </p>
      )}

      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
        <PlatformIcon className="size-3.5" aria-hidden="true" />
        {meta.label}
      </span>
    </section>
  )
}

export { ProfileIdentity }
