import { z } from 'zod';

export const creatorsValidationSchema = z.object({
  creators: z.array(z.string()).min(3),
});
