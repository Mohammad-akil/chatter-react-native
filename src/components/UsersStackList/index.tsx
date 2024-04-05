import { type FC, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { colorPalette } from '~/styles/colors';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import type { UsersStackListProps } from './types';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';

const ITEM_OFFSET = 10;

const UsersStackList: FC<UsersStackListProps> = ({ images, maxItemsToShow = images.length }) => {
  const itemsToShow = images.slice(0, maxItemsToShow);
  const imageItemsOffset = (itemsToShow.length - 1) * ITEM_OFFSET;

  const wrapperStyles = [styles.wrapper, { width: itemsToShow.length * normalize(56) - imageItemsOffset }];
  return (
    <View style={wrapperStyles}>
      {images.length !== maxItemsToShow && (
        <Flex flexDirection='row' alignItems='center' justifyContent='center' gap={2} style={styles.followers}>
          <Typography>{images.length - maxItemsToShow}</Typography>
          <IonIcon name='people-sharp' size={normalize(19)} color={colorPalette.white} />
        </Flex>
      )}
      {itemsToShow.map((item, index) => {
        const imageStyle = { left: -(index * ITEM_OFFSET) };
        return <Avatar key={index} url={item} size={56} style={imageStyle} />;
      })}
    </View>
  );
};

export default memo(UsersStackList);
