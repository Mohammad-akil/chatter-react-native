import { memo, useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { api } from '~/api';

import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';

const EndRoomModal = () => {
  const roomDetails = useRecoilValue(state.roomDetailsState);
  const setEndRoomModalOpened = useSetRecoilState(state.endRoomModalOpenedState);

  const [_visible, _setVisible] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    // WE NEED THIS TIMEOUT BECAUSE OF BUG WITH NOT SOWING MODAL EVENT IF _visible IS TRUE
    const timeoutId = setTimeout(() => _setVisible(true), 400);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const closeModal = useCallback(() => {
    _setVisible(false);
    setEndRoomModalOpened(false);
  }, [setEndRoomModalOpened]);

  const endRoom = useCallback(async () => {
    if (roomDetails?.id) {
      await api.room.endRoom(roomDetails?.id);
    }
    setEndRoomModalOpened(false);
    _setVisible(false);
  }, [roomDetails, setEndRoomModalOpened]);

  return (
    <Modal key='endRoomModal' animationType='fade' transparent={true} visible={_visible} onRequestClose={closeModal}>
      <Flex style={styles.modalBackground} justifyContent='center' alignItems='center' flex={1}>
        <Flex style={styles.modalView} gap={8}>
          <Flex gap={16} flexDirection='row' alignItems='flex-start' justifyContent='space-between'>
            <Typography style={styles.full} type='headline' size='small'>
              {t('room.endRoomForAll')}
            </Typography>
            <IconButton
              style={styles.closeButton}
              iconName='close-outline'
              type='text'
              size='lg'
              onPress={closeModal}
            />
          </Flex>
          <Typography type='body' size='default'>
            {t('room.endRoomAreUSure')}
          </Typography>
          <Flex
            style={styles.buttonContainer}
            flexDirection='row'
            gap={6}
            alignItems='flex-start'
            justifyContent='space-between'
          >
            <Button type='cancel' style={styles.full} text={t('common.cancel')} onPress={closeModal} />
            <Button type='red' style={styles.full} text={t('room.endRoom')} onPress={endRoom} />
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default memo(EndRoomModal);

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: colors.overlay.modal,
    paddingHorizontal: normalize(20),
  },
  modalView: {
    backgroundColor: colors.surface.surfaceComponent,
    padding: normalize(16),
    borderRadius: 6,
    width: '100%',
  },
  closeButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    paddingTop: 8,
  },
  full: {
    flex: 1,
  },
});
