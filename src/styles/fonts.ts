type FontWeight = 'thin' | 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black';
type FontStyle = 'italic';
type FontVariant = Capitalize<FontWeight> | `${Capitalize<FontWeight>}${Capitalize<FontStyle>}`;

type FontValue<FontName extends string, K extends string> = `${FontName}-${Capitalize<K>}`;
type Keys = Uncapitalize<FontVariant>;

type Font<FontName extends string> = {
  [Key in Keys]?: FontValue<FontName, Key>;
};

const lato: Font<'Lato'> = {
  thin: 'Lato-Thin',
  thinItalic: 'Lato-ThinItalic',
  light: 'Lato-Light',
  lightItalic: 'Lato-LightItalic',
  extraLight: 'Lato-ExtraLight',
  regular: 'Lato-Regular',
  medium: 'Lato-Medium',
  semiBold: 'Lato-SemiBold',
  bold: 'Lato-Bold',
  boldItalic: 'Lato-BoldItalic',
  extraBold: 'Lato-ExtraBold',
  black: 'Lato-Black',
  blackItalic: 'Lato-BlackItalic',
} as const;

const aeonik: Font<'Aeonik'> = {
  regular: 'Aeonik-Regular',
};

export const fonts = {
  lato: { ...lato },
  aeonik: { ...aeonik },
};
