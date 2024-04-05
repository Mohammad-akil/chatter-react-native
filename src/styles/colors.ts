export const colorPalette = {
  // PRIMARY
  primary100: '#CFE5E5',
  primary200: '#95DEDF',
  primary300: '#62DEDF',
  primary400: '#30D6D9',
  primary500: '#00CED1',
  primary600: '#00A3A6',
  primary700: '#028385',
  primary800: '#015859',
  primary900: '#003233',

  // SUCCESS
  success100: '#DAF2DB',
  success200: '#9CD69F',
  success300: '#78D67C',
  success400: '#4BC450',
  success450: '#009090',
  success500: '#24B229',
  success600: '#18861D',
  success700: '#127316',
  success800: '#0A4D0D',
  success900: '#042605',

  // WARNING
  warning100: '#FFF7E3',
  warning200: '#F2E0B1',
  warning300: '#F2D68D',
  warning400: '#EDC55C',
  warning500: '#E5B22E',
  warning600: '#BF921F',
  warning700: '#9A7412',
  warning800: '#664C08',
  warning900: '#332503',

  // ERROR
  error100: '#F2DBDA',
  error200: '#F5BBB8',
  error300: '#F59892',
  error400: '#ED675F',
  error500: '#E5392E',
  error600: '#BD2920',
  error700: '#941B13',
  error800: '#630E09',
  error900: '#330503',

  // BLUE
  blue100: '#DAE5F2',
  blue200: '#ADCBF0',
  blue300: '#81B3ED',
  blue400: '#4F95E8',
  blue450: '#2D94C1',
  blue500: '#227CE5',
  blue600: '#256ABA',
  blue700: '#0F498D',
  blue800: '#042B59',
  blue900: '#001226',

  // GREY
  grey50: '#F8F6F2',
  grey100: '#F5F1E9',
  grey200: '#E6E0D4',
  grey300: '#D5CEC0',
  grey400: '#B9B2A3',
  grey500: '#908B84',
  grey600: '#827C72',
  grey600_50: '#827C7280',
  grey650: '#53524E',
  grey700: '#393734',
  grey750: '#1F1C19',
  grey800: '#110E0A',
  grey850: '#0C0A07',
  grey900: '#0B0700',

  black: '#000',
  white: '#fff',
  white_03: '#ffffff4D',
} as const;

export const colors = {
  text: {
    textBrand: colorPalette.primary400,
    textDefault: colorPalette.grey50,
    textSecondary: colorPalette.grey300,
    textDisabled: colorPalette.grey400,
    textInputDisabled: colorPalette.grey400,
    textSuccess: colorPalette.success300,
    textDelete: colorPalette.error400,
    textError: colorPalette.error500,
    textLabel: colorPalette.grey100,
    tertiary: '#a4a4a4',
  },
  surface: {
    bottomTabBar: '#0F0F0F',

    buttonPrimaryNormal: colorPalette.primary700,
    buttonPrimaryPressed: colorPalette.primary800,
    buttonPrimaryDisabled: colorPalette.primary800,

    buttonDefaultNormal: colorPalette.grey700,
    buttonDefaultPressed: colorPalette.grey800,
    buttonDefaultHover: colorPalette.grey650,
    buttonDefaultDisabled: '#827c723d',

    surfaceComponent: colorPalette.grey750,
    surfacePrimary: colorPalette.grey850,
  },
  border: {
    borderPrimary: colorPalette.grey200,
    borderDisabled: colorPalette.grey400,
    borderFocused: colorPalette.primary600,
    borderError: colorPalette.error500,
  },
  overlay: {
    modal: '#000000CC',
  },
} as const;

export const allColors = {
  ...colorPalette,
  ...colors.text,
  ...colors.surface,
  ...colors.border,
} as const;
