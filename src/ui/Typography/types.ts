import { TextProps, TextStyle } from 'react-native';
import { allColors } from '~/styles/colors';
import { Base, Body, Display, Headline } from '~/styles/typography';

export type DisplayTypography = {
  type: 'display';
  size: Display;
};

export type HeadlineTypography = {
  type: 'headline';
  size: Headline;
};

export type LabelTypography = {
  type: 'label';
  size: Base;
};

export type BodyTypography = {
  type: 'body';
  size: Body;
};

export type TypographyBaseProps = {
  color?: keyof typeof allColors;
  textAlign?: TextStyle['textAlign'];
} & Partial<DisplayTypography | HeadlineTypography | LabelTypography | BodyTypography>;

export type TypographyProps = Prettify<TypographyBaseProps & TextProps>;
