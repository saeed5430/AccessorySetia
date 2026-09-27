import { Plus, ChevronLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatPrice } from "@/lib/utils"

interface ProductVariant {
  id: string
  productId: string
  productName: string
  productSlug: string
  color: string
  colorHex?: string
  size: string
  price: number
  image: string
  inStock: boolean
}

interface ProductCardProps {
  variant: ProductVariant
  onAddToCart: (variantId: string) => void
  isInCart?: boolean
  cartQuantity?: number
  compact?: boolean
}

function ProductCard({ variant, onAddToCart, isInCart = false, cartQuantity = 0, compact = false }: ProductCardProps) {
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(variant.id)
  }

  const handleQuantityChange = (_delta: number, e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (compact) {
    return (
      <Card variant="default" className="overflow-hidden transition-all duration-200 hover:shadow-setia-hover">
        <CardContent className="p-0">
          <div className="flex h-full">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-muted">
              {variant.image ? (
                <img
                  src={variant.image}
                  alt={variant.productName}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <span className="text-xs">بدون عکس</span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between p-3 min-w-0">
              <div className="min-w-0">
                <h3 className="font-medium text-foreground truncate">{variant.productName}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                  {variant.colorHex && (
                    <span
                      className="relative h-3 w-3 rounded-full ring-1 ring-border"
                      style={{ backgroundColor: variant.colorHex }}
                      aria-label={`رنگ: ${variant.color}`}
                    />
                  )}
                  <span>{variant.color}</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">سایز: {variant.size}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-foreground">{formatPrice(variant.price)}</span>
                {isInCart ? (
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="h-6 w-6 rounded-full"
                      onClick={(e) => handleQuantityChange(-1, e)}
                      aria-label="کم کردن تعداد"
                    >
                      <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </Button>
                    <span className="text-sm font-medium tabular-nums min-w-[1.5rem] text-center">{cartQuantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="h-6 w-6 rounded-full"
                      onClick={(e) => handleQuantityChange(1, e)}
                      aria-label="افزایش تعداد"
                    >
                      <Plus className="size-3" aria-hidden="true" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 rounded-[16px] px-3"
                    onClick={handleAddClick}
                    disabled={!variant.inStock}
                    aria-label={variant.inStock ? `افزودن ${variant.productName} به سبد` : "ناموجود"}
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="default" className="overflow-hidden transition-all duration-200 hover:shadow-setia-hover group">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {variant.image ? (
            <img
              src={variant.image}
              alt={variant.productName}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <span className="text-sm">بدون عکس</span>
            </div>
          )}
          {!variant.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="px-3 py-1.5 text-sm font-medium text-white bg-destructive/90 rounded-full backdrop-blur-sm">
                ناموجود
              </span>
            </div>
          )}
        </div>
        <div className="p-3 space-y-2">
          <h3 className="font-medium text-foreground line-clamp-1">{variant.productName}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {variant.colorHex && (
              <span
                className="relative h-2.5 w-2.5 rounded-full ring-1 ring-border shrink-0"
                style={{ backgroundColor: variant.colorHex }}
                aria-label={`رنگ: ${variant.color}`}
              />
            )}
            <span>{variant.color}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-muted rounded">سایز: {variant.size}</span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-lg text-foreground">{formatPrice(variant.price)}</span>
            {isInCart ? (
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7 rounded-full"
                  onClick={(e) => handleQuantityChange(-1, e)}
                  aria-label="کم کردن تعداد"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </Button>
                <span className="text-base font-medium tabular-nums min-w-[2rem] text-center">{cartQuantity}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7 rounded-full"
                  onClick={(e) => handleQuantityChange(1, e)}
                  aria-label="افزایش تعداد"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                className="h-9 rounded-[16px] px-4 text-sm font-medium shadow-setia"
                onClick={handleAddClick}
                disabled={!variant.inStock}
                aria-label={variant.inStock ? `افزودن ${variant.productName} به سبد خرید` : "ناموجود"}
              >
                <Plus className="size-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProductGridProps {
  variants: ProductVariant[]
  onAddToCart: (variantId: string) => void
  cartItems?: Map<string, number>
  compact?: boolean
  title?: string
  showViewAll?: boolean
  viewAllHref?: string
}

function ProductGrid({ variants, onAddToCart, cartItems = new Map(), compact = false, title, showViewAll = false, viewAllHref }: ProductGridProps) {
  if (variants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Package className="size-12 text-muted-foreground/50 mb-3" aria-hidden="true" />
        <p className="text-muted-foreground">محصولی یافت نشد</p>
      </div>
    )
  }

  return (
    <section className="mx-auto w-full max-w-lg px-4" aria-labelledby={title ? "products-title" : undefined}>
      {(title || showViewAll) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 id="products-title" className="font-heading text-lg font-semibold text-foreground">{title}</h2>}
          {showViewAll && viewAllHref && (
            <a href={viewAllHref} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              مشاهده همه
              <ChevronLeft className="size-3.5 rtl:rotate-180" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-2" : "grid-cols-2"
        )}
        role="list"
      >
        {variants.map((variant) => (
          <ProductCard
            key={variant.id}
            variant={variant}
            onAddToCart={onAddToCart}
            isInCart={cartItems.has(variant.id)}
            cartQuantity={cartItems.get(variant.id) || 0}
            compact={compact}
          />
        ))}
      </div>
    </section>
  )
}

export { ProductCard, ProductGrid }
export type { ProductVariant, ProductCardProps, ProductGridProps }