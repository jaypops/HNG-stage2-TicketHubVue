import { z } from 'zod'

// Individual validation helpers (optional, if you want to use them directly)
export const validateName = (name: string) => {
  if (!name.trim()) return 'Full name is required'
  if (name.trim().length < 3) return 'Full name must be at least 3 characters'
  return ''
}

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.trim()) return 'Email is required'
  if (!emailRegex.test(email)) return 'Enter a valid email address'
  return ''
}

export const validatePassword = (password: string) => {
  if (!password.trim()) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter'
  if (!/[0-9]/.test(password)) return 'Password must include a number'
  return ''
}

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword.trim()) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}

// ✅ Define Zod schema for the signup form
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Full name must be at least 3 characters')
      .nonempty('Full name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[0-9]/, 'Password must include at least one number'),
    confirmPassword: z.string().nonempty('Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// ✅ Type for TypeScript usage
export type SignupInput = z.infer<typeof signupSchema>

// ✅ Ticket validation helpers (for backward compatibility)
export const validateTicketTitle = (title: string) => {
  return title.trim().length >= 3
}

export const validateTicketDescription = (description: string) => {
  return description.trim().length >= 10
}

// ✅ Define Zod schema for ticket creation
export const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .nonempty('Title is required'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .nonempty('Description is required'),
  priority: z.enum(['low', 'medium', 'high']),
})

// ✅ Define Zod schema for ticket editing
export const editTicketSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .nonempty('Title is required'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .nonempty('Description is required'),
  status: z.enum(['open', 'in_progress', 'closed']),
  priority: z.enum(['low', 'medium', 'high']),
})

// ✅ Types for TypeScript usage
export type CreateTicketInput = z.infer<typeof createTicketSchema>
export type EditTicketInput = z.infer<typeof editTicketSchema>