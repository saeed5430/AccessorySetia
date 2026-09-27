import { z } from "zod"

export const profileSchema = z.object({
  firstName: z
    .string({ error: "نام خود را وارد کنید" })
    .trim()
    .min(1, { error: "نام خود را وارد کنید" })
    .min(2, { error: "نام باید حداقل ۲ حرف باشد" })
    .max(50, { error: "نام نباید بیشتر از ۵۰ حرف باشد" }),
  lastName: z
    .string({ error: "نام خانوادگی خود را وارد کنید" })
    .trim()
    .min(1, { error: "نام خانوادگی خود را وارد کنید" })
    .min(2, { error: "نام خانوادگی باید حداقل ۲ حرف باشد" })
    .max(50, { error: "نام خانوادگی نباید بیشتر از ۵۰ حرف باشد" }),
  phone: z
    .string({ error: "شماره تلفن خود را وارد کنید" })
    .trim()
    .min(1, { error: "شماره تلفن خود را وارد کنید" })
    .max(11, { error: "شماره تلفن نباید بیشتر از ۱۱ رقم باشد" })
    .regex(/^[0-9۰-۹٠-٩]{11}$/, { error: "شماره تلفن باید ۱۱ رقم باشد" }),
  address: z
    .string({ error: "آدرس خود را وارد کنید" })
    .trim()
    .min(1, { error: "آدرس خود را وارد کنید" })
    .min(10, { error: "آدرس باید حداقل ۱۰ حرف باشد" })
    .max(300, { error: "آدرس نباید بیشتر از ۳۰۰ حرف باشد" }),
  postalCode: z
    .string()
    .trim()
    .refine((value) => !value || /^[0-9۰-۹٠-٩]{10}$/.test(value), {
      error: "کد پستی باید ۱۰ رقم باشد",
    }),
})

export type ProfileValues = z.infer<typeof profileSchema>
