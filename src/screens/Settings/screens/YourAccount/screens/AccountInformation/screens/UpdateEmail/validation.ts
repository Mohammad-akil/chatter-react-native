import { z } from 'zod';
import { emailValidation } from '~/utils/validation';

export const changeEmailValidationSchema = z.object({
  email: emailValidation,
});
