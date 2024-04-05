import { z } from 'zod';

export const editProfileSchema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(3),
});
