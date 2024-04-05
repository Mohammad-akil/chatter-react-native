import { z } from 'zod';

export const editChannelSchema = z.object({
  name: z.string().min(3),
});
