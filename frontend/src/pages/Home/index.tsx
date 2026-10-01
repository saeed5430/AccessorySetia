import { useApp } from "@/contexts/AppContext"
import { useNavigate } from "react-router-dom"
import { AppHeader } from "@/components/AppHeader"
import { BottomNavigation } from "@/components/BottomNavigation"
import { ChevronLeft, Gem, History, ShoppingCart, Store, UserRound } from "lucide-react"

const homeActions = [
  {
    icon: UserRound,
    label: "مشخصات کاربری",
    description: "مشاهده و ویرایش اطلاعات",
    href: "/profile",
  },
  {
    icon: Store,
    label: "فروشگاه آنلاین",
    description: "مشاهده محصولات و ثبت سفارش",
    href: "/shop",
  },
  {
    icon: ShoppingCart,
    label: "سبد خرید و تکمیل خرید",
    description: "مشاهده سبد خرید و تکمیل پرداخت",
    href: "/cart",
  },
  {
    icon: History,
    label: "سوابق سفارشات",
    description: "مشاهده وضعیت سفارش‌ها",
    href: "/orders",
  },
] as const

function Home() {
  const { user } = useApp()
  const navigate = useNavigate()

  const firstName = user?.first_name ?? ""
  const lastName = user?.last_name ?? ""
  const username = user?.username ?? undefined
  const avatarUrl = user?.avatar_url ?? undefined

  const cartCount = 3

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground pb-[calc(72px+env(safe-area-inset-bottom))]">
      <AppHeader
        firstName={firstName}
        lastName={lastName}
        username={username}
        avatarUrl={avatarUrl}
      />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pt-6 pb-4">
        <section className="flex flex-col items-center gap-3" aria-label="خوش‌آمدگویی">
          <div className="flex size-16 items-center justify-center rounded-full bg-setia-gem/10 ring-1 ring-setia-gem/30">
            <Gem className="size-8 text-setia-gem" aria-hidden="true" />
          </div>
          <h1 className="text-center text-xl font-bold text-foreground">
            به فروشگاه ستیا خوش آمدید!
          </h1>
        </section>
        <nav className="mt-6 flex flex-col gap-3" aria-label="دسترسی سریع">
          {homeActions.map(({ icon: Icon, label, description, href }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(href)}
              className="flex w-full items-center gap-4 rounded-[20px] border border-border bg-card p-4 text-right shadow-setia transition-all duration-200 ease-out tap-highlight-transparent hover:border-primary/30 hover:shadow-setia-hover active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </span>
              <ChevronLeft className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          ))}
        </nav>
      </main>
      <BottomNavigation cartCount={cartCount} />
    </div>
  )
}

export default Home
