import { PhoneNumberUtil } from 'google-libphonenumber';
import { CountryCode } from 'react-native-country-picker-modal';
import { z } from 'zod';

const phoneUtil = PhoneNumberUtil.getInstance();
const isValidNumber = (number: string, countryCode: CountryCode) => {
  try {
    const parsedNumber = phoneUtil.parse(number, countryCode);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (err) {
    return false;
  }
};

export const phoneNumberSchema = z
  .object({
    countryCode: z.custom<CountryCode>(),
    countryCallCode: z.string(),
    phoneNumber: z.string(),
  })
  .refine(
    (schema) => {
      const phoneNumber = '+' + schema.countryCallCode + schema.phoneNumber;
      const countryCode = schema.countryCode;
      const isValid = isValidNumber(phoneNumber, countryCode);
      return isValid;
    },
    { message: 'Invalid Number', path: ['phone'] },
  );

export type PhoneNumberSchema = z.infer<typeof phoneNumberSchema>;
