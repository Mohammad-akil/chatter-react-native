import type { StyleProp, TextInputProps as RNTextInputProps, ViewStyle, TextStyle } from 'react-native';
import { Base, Body, Display, Headline, typography } from '~/styles/typography';

export type TextInputProps = {
  label?: string;
  withBorder?: boolean;
  bottomSheetInput?: boolean;
  hint?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  inputTypographyType?: keyof typeof typography;
  inputTypographySize?: Base | Body | Display | Headline;
} & Omit<RNTextInputProps, 'style'>;

export type ControlledTextInputProps = {
  name: string;
} & Omit<TextInputProps, 'error'>;

export type UseTextInputStylesProps = {
  focused: boolean;
  error?: string;
  editable: boolean;
  withBorder: boolean;
  inputTypographyType?: keyof typeof typography;
  inputTypographySize?: Base | Body | Display | Headline;
  style?: StyleProp<TextStyle>;
};
