import { z } from 'zod';

export const emptyObject = z.object({});
export const requiredString = z.string().min(1, { message: 'Required!' });
export const emailValidation = z.string().email('This is not a valid email');

export const requestedUserValidationSchema = z.object({
  id: z.string(),
  status: z.enum(['request', 'existing']),
});
