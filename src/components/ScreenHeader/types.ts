import type { ReactNode } from 'react';
import type { IconButtonProps } from '~/ui/IconButton/types';
import type { HeadlineTypography, TypographyProps } from '~/ui/Typography/types';
import type { StyleProp, TextProps, ViewStyle } from 'react-native';

export type ScreenHeaderProps = {
  style?: StyleProp<ViewStyle>;
  title?: string;
  titleSize?: HeadlineTypography['size'];
  titleProps?: TextProps;
  subTitle?: string;
  subTitleProps?: TextProps;
  description?: ReactNode;
  backButtonProps?: IconButtonProps;
  backIcon?: string;
  withBackButton?: boolean;
  onBack?: () => void;
  children?: ReactNode;
} & Pick<TypographyProps, 'color'>;
