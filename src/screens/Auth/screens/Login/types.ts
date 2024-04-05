import type { z } from 'zod';
import type { loginValidationSchema } from './validation';

export type LoginForm = z.infer<typeof loginValidationSchema>;
