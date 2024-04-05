import { forwardRef, memo, useMemo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { FlexProps } from './types';
import { minNormalizeValue, normalize } from '~/utils/normalize';

const Flex = memo(
  forwardRef<View, FlexProps>(({ children, style, ...flexProps }, ref) => {
    const { gap, rowGap, columnGap, ...restFlexProps } = flexProps;

    const sizingStyles = useMemo(() => {
      let gapValue, rowGapValue, columnGapValue;
      if (gap) {
        gapValue = gap >= minNormalizeValue ? normalize(gap) : gap;
      }
      if (rowGap) {
        rowGapValue = rowGap >= minNormalizeValue ? normalize(rowGap) : rowGap;
      }
      if (columnGap) {
        columnGapValue = columnGap >= minNormalizeValue ? normalize(columnGap) : columnGap;
      }
      return {
        gap: gapValue,
        rowGap: rowGapValue,
        columnGap: columnGapValue,
        elevation: 1,
      };
    }, [gap, rowGap, columnGap]);

    const styles = [sizingStyles, restFlexProps, style];

    return (
      <View style={styles} ref={ref}>
        {children}
      </View>
    );
  }),
);

export const AnimatedFlex = Animated.createAnimatedComponent(Flex);
export default Flex;
