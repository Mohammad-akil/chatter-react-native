import { z } from 'zod';
import { hasLowercaseCharacter, hasNumber, hasUppercaseCharacter, onlyLatin } from '~/utils/validation/helpers';
import { emailValidation } from '~/utils/validation';

function isValidUsername(str: string) {
  // eslint-disable-next-line no-useless-escape
  return str.match(/^[a-zA-Z0-9\.\_]+$/);
}

export const signUpFillInfoValidationSchema = z
  .object({
    email: emailValidation,
    username: z.string().min(4),
    first_name: z.string().min(1, 'Required!'),
    last_name: z.string().min(1, 'Required!'),
    password: z.string().min(6),
  })
  .superRefine(({ password, username, first_name, last_name }, ctx) => {
    // PASSWORD
    if (!onlyLatin(password)) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Only latin characters and numbers',
      });
    }
    if (!hasNumber(password)) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Must contain at least one number',
      });
    }
    if (!hasUppercaseCharacter(password)) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Must contain at least one uppercase charactrer',
      });
    }
    if (!hasLowercaseCharacter(password)) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Must contain at least one lowercase charactrer',
      });
    }

    // USERNAME
    if (!isValidUsername(username)) {
      ctx.addIssue({
        code: 'custom',
        path: ['username'],
        message: 'Username is not valid',
      });
    }

    // Name
    if (hasNumber(first_name)) {
      ctx.addIssue({
        code: 'custom',
        path: ['first_name'],
        message: 'Only letters allowed',
      });
    }

    if (hasNumber(last_name)) {
      ctx.addIssue({
        code: 'custom',
        path: ['last_name'],
        message: 'Only letters allowed',
      });
    }
  });
