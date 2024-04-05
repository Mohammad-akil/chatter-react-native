import type { StyleProp, ViewStyle, TextInputProps as RNTextInputProps } from 'react-native';

export type TextAreaProps = {
  label?: string;
  defaultHeight?: number;
  maxHeight?: number;
  withoutBorder?: boolean;
  style?: StyleProp<ViewStyle>;
} & Omit<RNTextInputProps, 'style'>;

export type ControlledTextAreaProps = {
  name: string;
} & TextAreaProps;
