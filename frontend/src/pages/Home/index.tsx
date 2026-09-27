import { useApp } from "@/contexts/AppContext"
import { AppHeader } from "@/components/AppHeader"
import { ProductGrid } from "@/components/ProductCard"
import { BottomNavigation } from "@/components/BottomNavigation"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Gem } from "lucide-react"
import type { ProductVariant } from "@/components/ProductCard"

const featureCards = [
  {
    icon: Gem,
    title: "اکسسوری و ست‌های شیک",
    description: "ست گردنبند، دست‌بند و گوشواره با طراحی‌های خاص و چشم‌نواز",
    color: "primary",
  },
  {
    icon: Star,
    title: "کیفیت عالی و ضدحساسیت",
    description: "تمام محصولات ما با مواد درجه‌یک و استاندارد بهداشتی ساخته شده‌اند",
    color: "secondary",
  },
] as const

const mockVariants: ProductVariant[] = [
  {
    id: "1",
    productId: "1",
    productName: "گردنبند الماسی عروس",
    productSlug: "diamond-bride-necklace",
    color: "طلایی",
    colorHex: "#B08D57",
    size: "45cm",
    price: 45000000,
    image: "/products/necklace1.jpg",
    inStock: true,
  },
  {
    id: "2",
    productId: "2",
    productName: "حلقه طلای ۱۸ عیار",
    productSlug: "18k-gold-ring",
    color: "طلایی",
    colorHex: "#D8C3A5",
    size: "۱۷",
    price: 12500000,
    image: "/products/ring1.jpg",
    inStock: true,
  },
  {
    id: "3",
    productId: "3",
    productName: "انگشتر یاقوت زهر",
    productSlug: "ruby-ring",
    color: "نقره‌ای",
    colorHex: "#C0C0C0",
    size: "۱۵",
    price: 8900000,
    image: "/products/ring2.jpg",
    inStock: true,
  },
  {
    id: "4",
    productId: "4",
    productName: "دستبند طلا با الماس",
    productSlug: "gold-diamond-bracelet",
    color: "طلایی",
    colorHex: "#B08D57",
    size: "۱۸cm",
    price: 32000000,
    image: "/products/bracelet1.jpg",
    inStock: false,
  },
  {
    id: "5",
    productId: "5",
    productName: "آویز یاقوت آبی",
    productSlug: "blue-sapphire-pendant",
    color: "نقره‌ای",
    colorHex: "#C0C0C0",
    size: "۲cm",
    price: 15600000,
    image: "/products/pendant1.jpg",
    inStock: true,
  },
  {
    id: "6",
    productId: "6",
    productName: "حلقه الماس سولیتیر",
    productSlug: "solitaire-diamond-ring",
    color: "طلایی",
    colorHex: "#D8C3A5",
    size: "۱۶",
    price: 55000000,
    image: "/products/ring3.jpg",
    inStock: true,
  },
]

function Home() {
  const { user } = useApp()
  const firstName = user?.first_name || "علی"
  const lastName = user?.last_name || "رضایی"

  const handleAddToCart = (variantId: string) => {
    console.log("Add to cart:", variantId)
  }

  const cartCount = 3

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground pb-[calc(72px+env(safe-area-inset-bottom))]">
      <AppHeader firstName={firstName} lastName={lastName} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pt-6 pb-4">
        <section className="flex flex-col items-center gap-3" aria-label="خوش‌آمدگویی">
          <div className="flex size-16 items-center justify-center rounded-full bg-setia-gem/10 ring-1 ring-setia-gem/30">
            <Gem className="size-8 text-setia-gem" aria-hidden="true" />
          </div>
          <h1 className="text-center text-xl font-bold text-foreground">
            به فروشگاه ستیا خوش آمدید!
          </h1>
        </section>
        <section className="mt-6 space-y-4" aria-label="ویژگی‌های فروشگاه">
          <div className="grid gap-3">
            {featureCards.map(({ icon: Icon, title, description, color }) => (
              <Card key={title} variant={color as "primary" | "secondary" | "default"} className="shadow-setia transition-all duration-200 hover:shadow-setia-hover">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <ProductGrid
          variants={mockVariants}
          onAddToCart={handleAddToCart}
          cartItems={new Map([["1", 1], ["3", 2]])}
          title="محصولات پیشنهادی"
          showViewAll
          viewAllHref="/products"
        />
      </main>
      <BottomNavigation cartCount={cartCount} />
    </div>
  )
}

export default Home