import type { ComponentProps } from "react"
import { CircleAlert } from "lucide-react"
import type { UseFormRegisterReturn } from "react-hook-form"
import { Input, inputBase } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ProfileFieldProps = {
  id: string
  label: string
  registration: UseFormRegisterReturn
  error?: string
  hint?: string
  optional?: boolean
  multiline?: boolean
  type?: ComponentProps<"input">["type"]
  inputMode?: ComponentProps<"input">["inputMode"]
  maxLength?: number
  autoComplete?: ComponentProps<"input">["autoComplete"]
}

function ProfileField({
  id,
  label,
  registration,
  error,
  hint,
  optional = false,
  multiline = false,
  type = "text",
  inputMode,
  maxLength,
  autoComplete,
}: ProfileFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-baseline gap-1.5 text-sm font-medium text-foreground"
      >
        {label}
        {optional ? (
          <span className="font-normal text-muted-foreground">اختیاری</span>
        ) : (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {multiline ? (
        <textarea
          id={id}
          rows={4}
          required={!optional}
          {...registration}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(inputBase, "min-h-32 resize-none py-3 leading-7")}
        />
      ) : (
        <Input
          id={id}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          required={!optional}
          {...registration}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      )}

      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-start gap-1.5 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

export { ProfileField }
