import { type FC, type ReactNode, memo, useMemo } from 'react';
import { type StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import type { TypographyProps } from '~/ui/Typography/types';
import Typography from '~/ui/Typography';

import { normalize } from '~/utils/normalize';
import { colorPalette, colors } from '~/styles/colors';
import VerifiedIcon from '../VerifiedIcon';

type NameTagProps = {
  children: ReactNode;
  option?: 'mod' | 'sub' | 'both';
  isHost?: boolean;
  isMod?: boolean;
  isVerified?: boolean;
  isSub?: boolean;
  size?: 'small' | 'default' | 'large';
  withBackground?: boolean;
  withoutPaddings?: boolean;
  style?: StyleProp<ViewStyle>;
};

const NameTag: FC<NameTagProps> = ({
  style,
  children,
  isHost,
  isMod,
  isSub,
  option,
  isVerified,
  size = 'default',
  withBackground,
  withoutPaddings,
}) => {
  const iconSize = normalize(16);
  const typographyProps: TypographyProps = useMemo(() => {
    if (size === 'large') {
      return { type: 'label', size: 'medium' };
    }

    return { type: 'body', size: 'semibold' };
  }, [size]);

  const containerStyles = [
    styles.base,
    withoutPaddings ? styles.zeroPadding : styles[size],
    withBackground && styles.background,
    style,
  ];

  return (
    <View style={containerStyles}>
      {isHost && <Icon size={iconSize} color={colorPalette.warning500} name='shield-sharp' />}
      {isMod && <Icon size={iconSize} color={colorPalette.success500} name='shield-sharp' />}
      {isSub && <Icon size={iconSize} color={colorPalette.blue300} name='fish' />}
      {isVerified && <VerifiedIcon />}
      <Typography style={styles.text} numberOfLines={1} ellipsizeMode='tail' {...typographyProps}>
        {children}
      </Typography>
    </View>
  );
};

export default memo(NameTag);

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    borderRadius: 6,
  },
  text: {
    maxWidth: '100%',
  },
  background: {
    backgroundColor: colors.surface.surfaceComponent,
  },
  small: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  default: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  large: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  zeroPadding: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
