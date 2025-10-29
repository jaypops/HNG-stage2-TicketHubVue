import { z } from 'zod'

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const getEmailError = (email: string): string => {
  if (!email.trim()) return 'Email is required'
  if (!validateEmail(email)) return 'Please enter a valid email'
  return ''
}

export const getPasswordError = (password: string): string => {
  if (!password) return 'Password is required'
  if (!validatePassword(password)) return 'Password must be at least 6 characters'
  return ''
}

export const validateName = (name: string) => {
  if (!name.trim()) return 'Full name is required'
  if (name.trim().length < 3) return 'Full name must be at least 3 characters'
  return ''
}

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword.trim()) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return ''
}

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Full name is required')
      .min(3, 'Full name must be at least 3 characters')
      .trim(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address')
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupInput = z.infer<typeof signupSchema>

export const validateTicketTitle = (title: string) => {
  return title.trim().length >= 3
}

export const validateTicketDescription = (description: string) => {
  return description.trim().length >= 10
}

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .trim(),
  status: z.enum(['open', 'in_progress', 'closed']),
  priority: z.enum(['low', 'medium', 'high']),
})

export const createTicketApiSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .trim(),
  priority: z.enum(['low', 'medium', 'high']),
})

export type CreateTicketInput = z.infer<typeof createTicketApiSchema>
export type CreateTicketFormInput = z.infer<typeof createTicketSchema>
export type EditTicketInput = z.infer<typeof ticketSchema>

export const ticketSchema = createTicketSchema
