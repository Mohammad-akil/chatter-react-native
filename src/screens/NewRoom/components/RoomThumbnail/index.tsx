import { FC, memo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { roomState } from '../../state';
import { commonStyles } from '~/styles';
import { normalize } from '~/utils/normalize';

type RoomThumbnailProps = {
  style?: StyleProp<ViewStyle>;
};

export const RoomThumbnail: FC<RoomThumbnailProps> = memo(({ style }) => {
  const { t } = useTranslation();
  const [roomData, setRoomData] = useRecoilState(roomState);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets) {
      const selectedImageURI = result.assets[0].uri;
      setRoomData((prev) => ({
        ...prev,
        thumbnail: selectedImageURI,
      }));
    }
  };

  return (
    <Flex style={style} gap={8}>
      <Typography style={commonStyles.aeonikRegular} type='label' size='large'>
        {t('common.thumbnail')}
      </Typography>
      <Flex flexDirection='row' alignItems='center' gap={12}>
        {!roomData.thumbnail ? (
          <View style={styles.noImageFallback}>
            <Icon name='images-outline' color='white' size={normalize(24)} />
          </View>
        ) : (
          <Avatar url={roomData.thumbnail || null} size={80} borderRadius='minimal' />
        )}
        <Flex flexDirection='row' gap={12}>
          <Button
            type='secondary'
            iconName='cloud-upload'
            size='sm'
            iconPosition='right'
            onPress={handleImagePick}
            text={t('common.upload')}
          />
          <Button type='text' iconName='search' size='sm' iconPosition='right' text={t('common.browseUnsplash')} />
        </Flex>
      </Flex>
    </Flex>
  );
});

const styles = StyleSheet.create({
  noImageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(27),
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 6,
  },
});
