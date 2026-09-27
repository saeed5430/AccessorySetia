import { Home, Store, ShoppingBag, History, UserRound } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: number
  isCenter?: boolean
}

const navItems: NavItem[] = [
  { id: "home", label: "خانه", icon: Home, href: "/" },
  { id: "shop", label: "فروشگاه آنلاین", icon: Store, href: "/shop" },
  { id: "cart", label: "سبد خرید", icon: ShoppingBag, href: "/cart", isCenter: true },
  { id: "orders", label: "سوابق سفارشات", icon: History, href: "/orders" },
  { id: "profile", label: "مشخصات", icon: UserRound, href: "/profile" },
]

interface BottomNavigationProps {
  cartCount?: number
  className?: string
}

function BottomNavigation({ cartCount = 0, className }: BottomNavigationProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigation = (href: string) => {
    if (href === "/cart") {
      navigate(href)
      return
    }
    navigate(href)
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg h-[72px] bg-card border-t border-border",
        "shadow-[0_-4px_20px_rgba(0,0,0,0.05)]",
        "safe-area-inset-bottom:pb-safe",
        className
      )}
      role="navigation"
      aria-label="نویگیشن اصلی"
    >
      <div className="flex h-full items-center justify-between px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href))
          const badge = item.id === "cart" ? cartCount : item.badge
          const Icon = item.icon

          if (item.isCenter) {
            return (
              <Button
                key={item.id}
                type="button"
                variant={isActive ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "relative size-14 rounded-[18px] transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-setia"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  "tap-highlight-transparent"
                )}
                onClick={() => handleNavigation(item.href)}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="relative flex h-full w-full items-center justify-center">
                  <Icon className="size-6" aria-hidden="true" />
                  {badge && badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </div>
              </Button>
            )
          }

          return (
            <Button
              key={item.id}
              type="button"
              variant={isActive ? "default" : "ghost"}
              size="icon"
              className={cn(
                "flex-1 h-[56px] rounded-[18px] transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                "tap-highlight-transparent"
              )}
              onClick={() => handleNavigation(item.href)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="flex flex-col items-center justify-center gap-1 h-full">
                <Icon className={cn("size-5 transition-transform", isActive && "scale-110")} aria-hidden="true" />
                <span className={cn("w-full truncate text-center text-[10px] font-medium leading-none", isActive && "text-primary")}>
                  {item.label}
                </span>
              </div>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}

export { BottomNavigation }
export type { NavItem }