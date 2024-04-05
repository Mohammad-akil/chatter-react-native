import { type FC, memo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import type { InterestProps } from './types';
import { colorPalette } from '~/styles/colors';
import { styles } from './styles';

const Interest: FC<InterestProps> = ({ id, text, isSelected, onClick, onSelectByName }) => {
  const buttonStyles = [
    styles.base,
    { borderColor: colorPalette.white, backgroundColor: isSelected ? colorPalette.grey600_50 : 'transparent' },
  ];

  const handlePress = useCallback(() => {
    if (onSelectByName) {
      onSelectByName?.(text);
      return;
    }

    onClick?.(id);
  }, [onClick, text, onSelectByName, id]);

  return (
    <Animated.View
      layout={LinearTransition.duration(300)}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <TouchableOpacity style={buttonStyles} onPress={handlePress}>
        <Typography style={styles.text} color='white'>
          {text}
        </Typography>
        <Icon style={styles.icon} name={isSelected ? 'checkmark' : 'add'} size={normalize(20)} color={'#FFFFFF'} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default memo(Interest);
