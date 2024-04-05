import { type FC, memo, useMemo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TextInput } from '~/ui/TextInput';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { colorPalette, colors } from '~/styles/colors';
import { typography } from '~/styles/typography';
import { commonStyles } from '~/styles';

import { usePhoneNumberInput } from './usePhoneNumber';

const flagButtonHitSlop = { left: 5, right: 5, top: 5, bottom: 5 };
const BUTTON_SIZE = 20;

type PhoneNumberInputProps = { style?: StyleProp<ViewStyle> };

const PhoneNumberInput: FC<PhoneNumberInputProps> = ({ style }) => {
  const { t } = useTranslation();

  const formContext = useFormContext();
  const {
    //PICKER
    countryPickerVisible,
    showCountryFlag,
    openPicker,
    closePicker,
    onSelectCountry,
    // FORM VALUES AND HANDLERS
    countryCode,
    countryCallCode,
    setCountryCallCode,
    phoneNumber,
    setPhoneNumber,
    invalid,
    errorMessage,
    //@ts-ignore
  } = usePhoneNumberInput(formContext);

  const textInputStyles = [
    commonStyles.flexFull,
    invalid && { borderBottomWidth: 0.5, borderBottomColor: colors.border.borderError },
  ];

  const countryCallCodeValue = useMemo(() => {
    return countryCallCode ? `+${countryCallCode}` : '';
  }, [countryCallCode]);

  return (
    <SafeAreaView style={style}>
      <Flex flex={1} flexDirection='row' alignItems='center' gap={24}>
        <Flex style={countryCodeInput.base} flexDirection='row'>
          <TextInput
            label={t('common.countryCode')}
            placeholder='+'
            keyboardType='number-pad'
            onChangeText={setCountryCallCode}
            withBorder={!invalid}
            containerStyle={textInputStyles}
            value={countryCallCodeValue}
          />
          <TouchableOpacity hitSlop={flagButtonHitSlop} style={countryCodeInput.flagButton} onPress={openPicker}>
            <CountryPicker
              theme={countryCodeInput.countryPickerPopup}
              countryCode={countryCode}
              onSelect={onSelectCountry}
              onClose={closePicker}
              containerButtonStyle={countryCodeInput.flag}
              visible={countryPickerVisible}
              withFilter
              withFlagButton={showCountryFlag}
              withCallingCode
              //@ts-ignore
              placeholder=''
              withAlphaFilter
            />
            <Icon name='chevron-down' size={normalize(BUTTON_SIZE)} color={colorPalette.white} />
          </TouchableOpacity>
        </Flex>
        <TextInput
          label={t('common.phoneNumber')}
          maxLength={15}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          containerStyle={textInputStyles}
          keyboardType='number-pad'
          withBorder={!invalid}
          autoCapitalize='none'
        />
      </Flex>
      {invalid && (
        <Typography type='label' size='small' color='textError'>
          {errorMessage}
        </Typography>
      )}
    </SafeAreaView>
  );
};

export default memo(PhoneNumberInput);

const countryCodeInput = StyleSheet.create({
  base: {
    width: '35%',
  },
  countryPickerPopup: {
    ...DARK_THEME,
    flagSizeButton: normalize(BUTTON_SIZE - 2),
    backgroundColor: colorPalette.grey850,
    onBackgroundTextColor: colors.text.textDefault,
    ...typography.body.medium,
  },
  flagButton: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    gap: normalize(12),
    height: normalize(BUTTON_SIZE + 2),
    flex: 1,
    right: 0,
    bottom: Platform.OS === 'ios' ? normalize(10) : normalize(16),
  },
  flag: {
    width: normalize(BUTTON_SIZE),
  },
});
