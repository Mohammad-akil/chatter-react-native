import { type FC, memo, useMemo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import Flex, { AnimatedFlex } from '../Flex';
import { allColors, colorPalette, colors } from '~/styles/colors';
import { LinearTransition } from 'react-native-reanimated';

type ProgressBarProps = {
  style?: StyleProp<ViewStyle>;
  color?: keyof typeof allColors;
  progress?: number;
};

const ProgressBar: FC<ProgressBarProps> = ({ style, color = 'textDefault', progress = 20 }) => {
  const containerStyles: StyleProp<ViewStyle> = useMemo(() => {
    return [styles.base, style];
  }, [style]);

  const progressStyles: StyleProp<ViewStyle> = useMemo(() => {
    return [styles.progress, { width: `${progress}%`, backgroundColor: allColors[color] }];
  }, [progress, color]);

  return (
    <Flex style={containerStyles} flex={1}>
      <AnimatedFlex layout={LinearTransition.duration(200)} style={progressStyles}></AnimatedFlex>
    </Flex>
  );
};

export default memo(ProgressBar);

const styles = StyleSheet.create({
  base: {
    height: 2,
    backgroundColor: colorPalette.grey600_50,
    width: '100%',
  },
  progress: {
    backgroundColor: colors.text.textDefault,
    height: '100%',
    borderRadius: 6,
  },
});
