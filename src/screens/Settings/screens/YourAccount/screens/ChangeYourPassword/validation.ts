import { z } from 'zod';
import { hasLowercaseCharacter, hasNumber, hasUppercaseCharacter, onlyLatin } from '~/utils/validation/helpers';

export const updatePasswordValidationSchema = z
  .object({
    newPassword: z.string().min(6, 'Required!'),
    confirmPassword: z.string().min(6),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    // PASSWORD
    if (!onlyLatin(newPassword)) {
      ctx.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: 'Only latin characters and numbers',
      });
    }
    if (!hasLowercaseCharacter(newPassword)) {
      ctx.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: 'Must contain at least one lowercase character',
      });
    }
    if (!hasNumber(newPassword)) {
      ctx.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: 'Must contain at least one number',
      });
    }
    if (!hasUppercaseCharacter(newPassword)) {
      ctx.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: 'Must contain at least one uppercase character',
      });
    }

    // MATCH PASSWORD AND CONFIRM PASSWORD
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });
