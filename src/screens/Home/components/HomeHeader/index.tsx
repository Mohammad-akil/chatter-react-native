import { type FC, memo, ReactNode } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { colorPalette } from '~/styles/colors';
import ChatterIcon from '~/ui/ChatterIcon';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';

type HomeHeaderProps = {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const HomeHeader: FC<HomeHeaderProps> = ({ style, children }) => {
  return (
    <Flex style={[styles.base, style]} flexDirection='row' justifyContent='space-between' alignItems='center'>
      <ChatterIcon name='chatter-primary-logo' size={45} color={colorPalette.primary400} />
      <Flex flexDirection='row'>{children}</Flex>
    </Flex>
  );
};

export default memo(HomeHeader);

const styles = StyleSheet.create({
  base: {
    paddingTop: normalize(20),
    paddingBottom: normalize(20),
    paddingHorizontal: normalize(20),
    gap: normalize(12),
  },
});
