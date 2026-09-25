import { House } from "lucide-react"

function WelcomeSection() {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-col items-center gap-3 px-4 pt-7 pb-1 text-center">
      <div
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <House className="size-7" />
      </div>
      <h1 className="font-heading text-lg font-semibold tracking-tight">
        به فروشگاه ستیا خوش آمدید
      </h1>
    </section>
  )
}

export { WelcomeSection }
