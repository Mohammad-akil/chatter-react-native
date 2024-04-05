import { type FC, memo, useMemo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';
import { useTranslation } from 'react-i18next';

type RequestToJoinProps = {
  style?: StyleProp<ViewStyle>;
  size?: number;
};

const RequestToJoin: FC<RequestToJoinProps> = ({ style, size = 170 }) => {
  const { t } = useTranslation();

  const containerStyles = useMemo(() => {
    return [
      styles.base,
      {
        minWidth: normalize(size),
        minHeight: normalize(size),
      },
      style,
    ];
  }, [style, size]);

  return (
    <View style={containerStyles}>
      <TouchableOpacity>
        <Flex gap={8} alignItems='center'>
          <Flex style={styles.buttonIcon}>
            <Icon name='videocam-outline' size={normalize(20)} color={colors.text.textDefault} />
          </Flex>
          <Typography type='body' size='small'>
            {t('room.requestToJoin')}
          </Typography>
        </Flex>
      </TouchableOpacity>
    </View>
  );
};

export default memo(RequestToJoin);

const styles = StyleSheet.create({
  base: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  buttonIcon: {
    padding: normalize(24),
    borderRadius: 360,
    borderColor: colors.border.borderPrimary,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
});
