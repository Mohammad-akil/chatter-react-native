import { z } from 'zod';

export const interestsFormValidation = z.object({
  interests: z.array(z.string()).min(3),
  search: z.string(),
});
