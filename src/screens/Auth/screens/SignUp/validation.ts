import { z } from 'zod';
import { emailValidation } from '~/utils/validation';

export const signUpValidationSchema = z.object({
  email: emailValidation,
});
