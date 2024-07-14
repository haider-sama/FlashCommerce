import { z } from "zod";

// Custom validation messages
const passwordMinLengthMessage = 'Password must be at least 8 characters long.';
const passwordUppercaseMessage = 'Password must contain at least one uppercase letter.';
const passwordLowercaseMessage = 'Password must contain at least one lowercase letter.';
const passwordNumberMessage = 'Password must contain at least one number.';
const passwordSpecialCharMessage = 'Password must contain at least one special character (!@#$%^&*).';

export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string()
  .min(8, { message: passwordMinLengthMessage })
  .refine((val) => /[A-Z]/.test(val), { message: passwordUppercaseMessage })
  .refine((val) => /[a-z]/.test(val), { message: passwordLowercaseMessage })
  .refine((val) => /\d/.test(val), { message: passwordNumberMessage })
  .refine((val) => /[!@#$%^&*]/.test(val), { message: passwordSpecialCharMessage }),
})

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>