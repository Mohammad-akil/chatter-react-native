import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View } from 'react-native';
import { allColors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

type RecordIconProps = {
  size?: number;
  color?: keyof typeof allColors;
  style?: StyleProp<ViewStyle>;
};

const RecordIcon: FC<RecordIconProps> = ({ size = 20, color = 'error400', style }) => {
  const containerStyles = [recording.base, style];
  const iconOuterStyles = [
    recording.iconOuter,
    { width: normalize(size), height: normalize(size), backgroundColor: allColors[color] },
  ];
  const iconInnerStyles = [recording.iconInner, { width: normalize(size - 3), height: normalize(size - 3) }];

  return (
    <View style={containerStyles}>
      <View style={iconOuterStyles}>
        <View style={iconInnerStyles} />
      </View>
    </View>
  );
};

export default memo(RecordIcon);

const recording = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOuter: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(100),
  },
  iconInner: {
    borderWidth: 0.5,
    borderRadius: normalize(100),
  },
});
