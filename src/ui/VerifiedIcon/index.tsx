import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '~/styles/colors';

type VerifiedIconProps = {
  style?: StyleProp<ViewStyle>;
};

const VerifiedIcon: FC<VerifiedIconProps> = ({ style }) => {
  return <Icon style={style} name='checkmark-circle' color={colors.text.textBrand} size={16} />;
};

export default memo(VerifiedIcon);
