import { useCallback, useEffect, useState } from 'react';
import { type FieldValues, useController, UseFormReturn } from 'react-hook-form';
import { type Country, type CountryCode, getAllCountries, FlagType } from 'react-native-country-picker-modal';
import { getCountry } from 'react-native-localize';

const userCountry = getCountry() as CountryCode;
const DEFAULT_COUNTRY_CODE: CountryCode = userCountry || 'US';

export const usePhoneNumberInput = (formContext: UseFormReturn<FieldValues, any>) => {
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [showCountryFlag, setShowCountryFlag] = useState(true);
  const [invalid, setInvalid] = useState(false);

  const { control, formState } = formContext;
  const { errors, isValid } = formState;

  const errorMessage = errors['phone']?.message?.toString();

  const { field: countryCodeField } = useController({
    name: 'countryCode',
    control: control,
  });

  const { field: countryCallCodeField } = useController({
    name: 'countryCallCode',
    control: control,
  });

  const { field: phoneNumberField } = useController({
    name: 'phoneNumber',
    control: control,
  });

  const { onChange: onChangeCountryCode, value: countryCodeValue } = countryCodeField;
  const { onChange: onChangeCountryCallCode, value: countryCallCodeValue } = countryCallCodeField;
  const { onChange: onChangePhoneNumber, value: phoneNumberValue } = phoneNumberField;

  const handleChangeCountryCode = useCallback(
    (value: string) => {
      onChangeCountryCode({ target: { value, name: 'countryCode' } });
    },
    [onChangeCountryCode],
  );

  const handleChangeCountryCallCode = useCallback(
    (value: string) => {
      const text = value.replace(/\D+/g, '');
      handleChangeCountryCode('');
      onChangeCountryCallCode({ target: { value: text, name: 'countryCallCode' } });
      setShowCountryFlag(false);
    },
    [onChangeCountryCallCode, handleChangeCountryCode],
  );

  const handleChangePhoneNumber = useCallback(
    (value: string) => {
      const text = value.replace(/\D/g, '');
      onChangePhoneNumber({ target: { value: text, name: 'phoneNumber' } });
    },
    [onChangePhoneNumber],
  );

  const onSelectCountry = useCallback(
    (country: Country) => {
      handleChangeCountryCallCode(country.callingCode[0] ?? '');
      handleChangeCountryCode(country.cca2);
      handleChangePhoneNumber('');
      setShowCountryFlag(true);
    },
    [handleChangeCountryCallCode, handleChangeCountryCode, handleChangePhoneNumber],
  );

  const openPicker = useCallback(() => {
    setCountryPickerVisible(true);
  }, []);

  const closePicker = useCallback(() => {
    setCountryPickerVisible(false);
  }, []);

  useEffect(() => {
    const setDefaultCountry = async () => {
      const countries = await getAllCountries(FlagType.EMOJI);

      const _country = countries.find((country) => country.cca2 === DEFAULT_COUNTRY_CODE);
      handleChangeCountryCallCode(_country?.callingCode[0] ?? '');
      handleChangeCountryCode(DEFAULT_COUNTRY_CODE);
      setShowCountryFlag(true);
    };
    setDefaultCountry();
  }, []);

  useEffect(() => {
    setInvalid(!isValid && Boolean(errors['phone']));
  }, [isValid, errors]);

  return {
    //PICKER
    countryPickerVisible,
    showCountryFlag,
    openPicker,
    closePicker,
    onSelectCountry,
    // FORM VALUES AND HANDLERS
    countryCode: countryCodeValue,
    setCountryCode: handleChangeCountryCode,
    countryCallCode: countryCallCodeValue,
    setCountryCallCode: handleChangeCountryCallCode,
    phoneNumber: phoneNumberValue,
    setPhoneNumber: handleChangePhoneNumber,
    invalid,
    errorMessage: errorMessage,
  };
};
