import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native';
import { colors } from '~/styles/colors';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import { TextInput } from '~/ui/TextInput';
import Button from '~/ui/Button';
import { api } from '~/api';
import { useRecoilState, useRecoilValue } from 'recoil';
import { state } from '../../state/roomState';

function PasteLinkModal() {
  const { t } = useTranslation();

  const { height } = useWindowDimensions();
  const [modalHeight, setModalHeight] = useState<number>(0);
  const positionOfModal = { top: height / 2 - modalHeight / 2 };

  const roomDetails = useRecoilValue(state.roomDetailsState);
  const [createPinnedLinkOpened, setCreatePinnedLinkOpened] = useRecoilState(state.createLinkPopupOpenedState);

  const [linkValue, setLinkValue] = useState('');

  const closePopup = useCallback(() => {
    setCreatePinnedLinkOpened(false);
  }, [setCreatePinnedLinkOpened]);

  const onModalLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setModalHeight(height);
  };
  const handleChangeText = useCallback((value: string) => {
    setLinkValue(value);
  }, []);
  const createPinnedLink = useCallback(() => {
    async function createPinnedLinkRequest() {
      await api.room.createPinnedLink({ url: linkValue, room: roomDetails?.id });
    }
    createPinnedLinkRequest();
    setLinkValue('');
    closePopup();
  }, [linkValue, roomDetails?.id, closePopup]);

  return (
    <Modal
      key='newPinnedLinkModal'
      animationType='fade'
      transparent={true}
      visible={createPinnedLinkOpened}
      onRequestClose={closePopup}
    >
      <TouchableWithoutFeedback onPress={closePopup}>
        <View style={styles.modalBackground} />
      </TouchableWithoutFeedback>
      <View style={[styles.modalView, positionOfModal]} onLayout={onModalLayout}>
        <Flex gap={2}>
          <Typography type='label' size='medium'>
            {t('room.addPinnedLink')}
          </Typography>
          <TextInput
            placeholder={'https://x.com/geeken'}
            autoCapitalize='none'
            withBorder
            value={linkValue}
            onChangeText={handleChangeText}
          />
        </Flex>
        <Flex flexDirection='row' gap={6}>
          <Flex flex={1}>
            <Button type='cancel' text={t('common.cancel')} onPress={closePopup} />
          </Flex>
          <Flex flex={1}>
            <Button text={t('common.add')} disabled={!linkValue.trim()} onPress={createPinnedLink} />
          </Flex>
        </Flex>
      </View>
    </Modal>
  );
}

export default memo(PasteLinkModal);

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: colors.overlay.modal,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  modalView: {
    backgroundColor: colors.surface.surfaceComponent,
    padding: normalize(16),
    borderRadius: 6,
    marginHorizontal: normalize(16),
    gap: normalize(16),
  },
});
