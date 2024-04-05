import { type ViewStyle, type PressableProps, type StyleProp } from 'react-native';

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'text'
  | 'black'
  | 'cancel'
  | 'report'
  | 'red'
  | 'toast-normal'
  | 'toast-outlined-normal'
  | 'toast-error'
  | 'toast-outlined-error'
  | 'contribute'
  | 'contribute-option';
export type ButtonVariantsWithInverted = ButtonVariants | `${ButtonVariants}-inverted`;

type ButtonState = 'pressed' | 'disabled' | 'active';
type ButtonVariantWithState = ButtonVariantsWithInverted | `${ButtonVariantsWithInverted}-${ButtonState}`;

export type ColorStyleOptions<T> = { [K in ButtonVariantWithState]?: T };

export type ButtonSizes = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ButtonSizesWithEqualPaddings = ButtonSizes | `${ButtonSizes}-eq`;

export type SizeStyleOptions<T> = {
  [Property in ButtonSizesWithEqualPaddings]?: T;
};

type ButtonPropsBase = {
  type?: ButtonVariants;
  colorInverted?: boolean;
  size?: ButtonSizes;
  text: string;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
} & Omit<PressableProps, 'style'>;

type ButtonWithoutIcon = {
  iconPosition: undefined;
  iconName: undefined;
};

type ButtonWithIcon = {
  iconPosition: 'left' | 'right';
  iconName: string;
};

export type ButtonProps = Prettify<ButtonPropsBase & (ButtonWithIcon | Partial<ButtonWithoutIcon>)>;
