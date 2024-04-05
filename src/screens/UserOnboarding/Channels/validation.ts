import { z } from 'zod';

export const channelsValidationSchema = z.object({
  channels: z.array(z.string()).min(3),
});
