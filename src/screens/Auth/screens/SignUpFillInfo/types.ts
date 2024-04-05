import type { z } from 'zod';
import type { signUpFillInfoValidationSchema } from './validation';

export type SignUpFillInfoForm = z.infer<typeof signUpFillInfoValidationSchema>;
