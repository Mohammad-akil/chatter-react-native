import { type ViewStyle, type PressableProps, StyleProp, ColorValue } from 'react-native';

export type IconButtonVariants =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'text'
  | 'room-control'
  | 'send'
  | 'delete'
  | 'toast-normal'
  | 'toast-error'
  | 'room-list'
  | 'conversation-record'
  | 'delete-control'
  | 'red';

export type IconButtonVariantsWithInverted = IconButtonVariants | `${IconButtonVariants}-inverted`;

type RoomControlState = 'requested' | 'on';
type IconButtonState = 'pressed' | 'disabled' | 'active';

type BaseVariantWithState<T extends string> = T | `${T}-${IconButtonState}`;
type RoomControlVariantWithState<T extends string> = T | `${T}-${IconButtonState}` | `${T}-${RoomControlState}`;

type IconButtonVariantWithState<T> = T extends 'room-control' | 'room-control-inverted'
  ? RoomControlVariantWithState<T>
  : T extends string
    ? BaseVariantWithState<T>
    : never;

export type ColorStyleOptions<T> = { [K in IconButtonVariantWithState<IconButtonVariantsWithInverted>]?: T };

export type IconButtonSizes = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type IconButtonRadiuses = 'full' | 'minimal';

export type SizeStyleOptions<T> = {
  [Property in IconButtonSizes]: T;
};

type IconButtonBaseProps = Prettify<{
  type?: Exclude<IconButtonVariants, 'room-control'>;
  colorInverted?: boolean;
  iconName: string;
  size?: IconButtonSizes;
  active?: boolean;
  borderRadius?: IconButtonRadiuses;
  badgeCount?: number;
  transparent?: boolean;
  sizeOfIcon?: number;
  colorOfIcon?: ColorValue;
  style?: StyleProp<ViewStyle>;
}>;

type WithRoomControlProps = {
  type?: 'room-control';
  requested?: boolean;
  on?: boolean;
} & Omit<IconButtonBaseProps, 'type'>;

type WithSendProps = {
  type?: 'send';
} & Omit<IconButtonBaseProps, 'type'>;

export type IconButtonProps = (IconButtonBaseProps | WithRoomControlProps | WithSendProps) &
  Omit<PressableProps, 'style'>;
