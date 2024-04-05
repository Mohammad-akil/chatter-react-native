import { type FC, memo, useCallback } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import Flex from '~/ui/Flex';
import { colorPalette, colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';
import FastImage from 'react-native-fast-image';
import { useSetRecoilState } from 'recoil';
import { channelState, typeOfUploadImage } from '../../state';
import openEditAvatarModal from '../../utils/openEditAvatarModal';
import { useTranslation } from 'react-i18next';

import { Dispatch, SetStateAction } from 'react';

export type ChannelPreviewProps = { style?: StyleProp<ViewStyle>; banner?: string | null } & (
  | {
      view: 'owner';
      selectedChannelId: string;
      setModalIsOpen: Dispatch<SetStateAction<boolean>>;
    }
  | {
      view: 'preview';
      selectedChannelId?: undefined;
      setModalIsOpen?: undefined;
    }
);

const ChannelPreview: FC<ChannelPreviewProps> = ({ view, banner, selectedChannelId, setModalIsOpen }) => {
  const setChannel = useSetRecoilState(channelState);
  const setTypeOfImage = useSetRecoilState(typeOfUploadImage);
  const { t } = useTranslation();
  const openModal = useCallback(() => {
    if (view === 'owner') {
      setTypeOfImage('banner');
      setModalIsOpen(true);
    }
  }, [setModalIsOpen, setTypeOfImage, view]);

  const handleChangeBanner = useCallback(() => {
    if (view === 'owner') {
      openEditAvatarModal(selectedChannelId, openModal, 'banner', setChannel, t);
    }
  }, [openModal, selectedChannelId, setChannel, view, t]);

  return (
    <Pressable onPress={handleChangeBanner}>
      <View style={styles.wrapper}>
        <Flex style={styles.separator} />
        <FastImage source={{ uri: banner ?? undefined }} style={styles.content} />
      </View>
    </Pressable>
  );
};

export const styles = StyleSheet.create({
  wrapper: {
    height: normalize(175),
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    borderRadius: 6,
    borderTopLeftRadius: normalize(80),
    backgroundColor: colors.surface.surfaceComponent,
  },
  separator: {
    backgroundColor: colorPalette.grey900,
    width: 6,
    height: '100%',
    position: 'absolute',
    right: 0,
    left: '50%',
    zIndex: 200,
  },
});

export default memo(ChannelPreview);
