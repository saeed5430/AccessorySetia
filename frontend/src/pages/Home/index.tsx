import { ChevronLeft, CreditCard, Lock, ShoppingBag, Truck, UserRound } from "lucide-react"
import { AppHeader } from "@/components/AppHeader"
import { WelcomeSection } from "@/components/WelcomeSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const menuItems = [
  {
    id: "profile",
    title: "مشخصات مشتری",
    subtitle: "مشاهده و ویرایش اطلاعات حساب کاربری",
    icon: UserRound,
  },
  {
    id: "order",
    title: "سفارش آنلاین",
    subtitle: "مشاهده محصولات و ثبت سفارش جدید",
    icon: ShoppingBag,
  },
  {
    id: "cart",
    title: "سبد خرید و تکمیل خرید",
    subtitle: "دیدن سبد خرید و استفاده از روش‌های پرداخت",
    icon: CreditCard,
  },
  {
    id: "tracking",
    title: "پیگیری سفارشات",
    subtitle: "مشاهده وضعیت و تاریخچه سفارش‌ها",
    icon: Truck,
  },
  {
    id: "admin",
    title: "ورود به ادمین",
    subtitle: "مدیریت فروشگاه و تنظیمات سیستم",
    icon: Lock,
  },
] as const

function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <AppHeader firstName="علی" lastName="رضایی" />
      <WelcomeSection />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pt-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
        <Card>
          <CardContent className="flex flex-col gap-3">
            {menuItems.map(({ id, title, subtitle, icon: Icon }) => (
              <Button
                key={id}
                type="button"
                variant="ghost"
                className="h-auto w-full justify-start gap-3 rounded-xl bg-muted/60 px-4 py-3.5 text-start transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-muted"
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-base font-semibold">{title}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {subtitle}
                  </span>
                </span>
                <ChevronLeft
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              </Button>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Home
