import { z } from 'zod';

function isValidUsername(str: string) {
  // eslint-disable-next-line no-useless-escape
  return str.match(/^[a-zA-Z0-9\.\_]+$/);
}

export const changeUsernameValidationSchema = z
  .object({
    username: z.string().min(4),
  })
  .superRefine(({ username }, ctx) => {
    if (!isValidUsername(username)) {
      ctx.addIssue({
        code: 'custom',
        path: ['username'],
        message: 'Username is not valid',
      });
    }
  });
