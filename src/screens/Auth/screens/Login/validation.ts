import { z } from 'zod';
import { emailValidation, requiredString } from '~/utils/validation';

export const loginValidationSchema = z.object({
  email: emailValidation,
  password: requiredString,
});
