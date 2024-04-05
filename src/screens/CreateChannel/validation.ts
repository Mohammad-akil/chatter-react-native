import { z } from 'zod';
import { requestedUserValidationSchema } from '~/utils/validation';

export const validationSchema = z.object({
  name: z
    .string()
    .min(3)
    .refine((value) => value.trim().length > 0, {
      message: 'Name must have at least 3 characters excluding whitespace',
    }),
  description: z
    .string()
    .min(5)
    .refine((value) => value.trim().length > 0, {
      message: 'Description must have at least 5 characters excluding whitespace',
    }),
  admins: z.array(requestedUserValidationSchema),
  leaders: z.array(requestedUserValidationSchema),
});
