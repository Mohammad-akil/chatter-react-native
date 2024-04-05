import type { z } from 'zod';
import type { validationSchema } from '../validation';

export type CreateChannelForm = z.infer<typeof validationSchema>;
