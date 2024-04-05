import type { z } from 'zod';
import type { signUpValidationSchema } from './validation';

export type SignUpForm = z.infer<typeof signUpValidationSchema>;
