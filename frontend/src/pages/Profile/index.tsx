import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Check, ChevronRight, ClipboardList, Save } from "lucide-react"
import { BottomNavigation } from "@/components/BottomNavigation"
import { Button } from "@/components/ui/button"
import { useApp } from "@/contexts/AppContext"
import type { AppUser } from "@/types/account"
import { ProfileField } from "./ProfileField"
import { ProfileIdentity } from "./ProfileIdentity"
import { profileSchema, type ProfileValues } from "./schema"

function Profile() {
  const { user, platform, updateProfile } = useApp()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: user?.first_name ?? "",
      lastName: user?.last_name ?? "",
      phone: user?.mobile_number ?? "",
      address: user?.address ?? "",
      postalCode: user?.postal_code ?? "",
    },
  })

  useEffect(() => {
    reset({
      firstName: user?.first_name ?? "",
      lastName: user?.last_name ?? "",
      phone: user?.mobile_number ?? "",
      address: user?.address ?? "",
      postalCode: user?.postal_code ?? "",
    })
  }, [user, reset])

  const onSubmit = handleSubmit(async (values: ProfileValues) => {
    const result = await updateProfile({
      first_name: values.firstName,
      last_name: values.lastName,
      mobile_number: values.phone,
      address: values.address,
      postal_code: values.postalCode ? values.postalCode : null,
    })

    if (result.success) {
      reset(values)
      navigate("/")
      return
    }

    if (result.fieldErrors) {
      const fieldMap: Record<
        string,
        "firstName" | "lastName" | "phone" | "address" | "postalCode"
      > = {
        first_name: "firstName",
        last_name: "lastName",
        mobile_number: "phone",
        address: "address",
        postal_code: "postalCode",
      }

      for (const [backendField, message] of Object.entries(result.fieldErrors)) {
        const frontendField = fieldMap[backendField as keyof typeof fieldMap]
        if (frontendField) {
          setError(frontendField, { type: "server", message })
        } else {
          setError("root", { type: "server", message })
        }
      }
      return
    }

    setError("root", {
      type: "server",
      message: result.message ?? "ذخیره اطلاعات ناموفق بود.",
    })
  })

  const accountForIdentity: AppUser | null = user
    ? {
        id: user.id,
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? undefined,
        username: user.username ?? undefined,
        photo_url: user.avatar_url ?? undefined,
      }
    : null

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground pb-[calc(72px+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-lg items-center gap-1 px-3 pt-[calc(env(safe-area-inset-top)_+_8px)]">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11"
          aria-label="بازگشت"
          onClick={() => navigate(-1)}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">مشخصات کاربری</h1>
      </div>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 pt-2 pb-4">
        <ProfileIdentity
          user={accountForIdentity as any}
          platform={platform}
        />

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <section
            aria-label="اطلاعات تحویل"
            className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-4 shadow-setia"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="size-5" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">
                  اطلاعات تحویل
                </span>
                <span className="text-xs text-muted-foreground">
                  برای ثبت سفارش و ارسال مرسوله
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <ProfileField
                  id="firstName"
                  label="نام"
                  registration={register("firstName")}
                  error={errors.firstName?.message}
                  autoComplete="given-name"
                />
                <ProfileField
                  id="lastName"
                  label="نام خانوادگی"
                  registration={register("lastName")}
                  error={errors.lastName?.message}
                  autoComplete="family-name"
                />
              </div>

              <ProfileField
                id="phone"
                label="شماره تلفن"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                autoComplete="tel"
                registration={register("phone")}
                error={errors.phone?.message}
                hint="شماره موبایل ۱۱ رقمی بدون فاصله"
              />

              <ProfileField
                id="address"
                label="آدرس"
                multiline
                registration={register("address")}
                error={errors.address?.message}
                autoComplete="street-address"
              />

              <ProfileField
                id="postalCode"
                label="کد پستی"
                optional
                inputMode="numeric"
                maxLength={10}
                autoComplete="postal-code"
                registration={register("postalCode")}
                error={errors.postalCode?.message}
                hint="کد پستی ۱۰ رقمی"
              />
            </div>
          </section>

          {errors.root?.message && (
            <div
              role="alert"
              className="rounded-[16px] border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {errors.root.message}
            </div>
          )}

          <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isSubmitting}>
            <Save aria-hidden="true" data-icon="inline-start" />
            {isSubmitting ? "در حال ذخیره..." : "ذخیره اطلاعات"}
          </Button>

          {user?.is_profile_completed && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-[16px] border border-primary/30 bg-primary/10 p-3"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium text-foreground">
                پروفایل شما کامل است
              </p>
            </div>
          )}
        </form>
      </main>

      <BottomNavigation />
    </div>
  )
}

export default Profile
