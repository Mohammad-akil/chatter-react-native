import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type FlexProps = Pick<
  ViewStyle,
  'flex' | 'flexDirection' | 'alignItems' | 'alignSelf' | 'justifyContent' | 'rowGap' | 'columnGap' | 'gap' | 'flexWrap'
> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};
