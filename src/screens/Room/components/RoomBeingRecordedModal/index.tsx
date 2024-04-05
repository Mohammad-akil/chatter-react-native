import { FC, useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';

import { colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

type RoomBeingRecordedProps = {
  leaveRoom: () => void;
};

const RoomBeingRecorded: FC<RoomBeingRecordedProps> = ({ leaveRoom }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timeoutId = setTimeout(() => setModalVisible(true), 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleLeaveRoom = useCallback(() => {
    setModalVisible(false);
    leaveRoom();
  }, [leaveRoom]);

  return (
    <Modal
      key='roomBeingRecordedModal'
      animationType='fade'
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <Flex style={styles.modalBackground} justifyContent='center' alignItems='center' flex={1}>
        <Flex style={styles.modalView} gap={8}>
          <Flex gap={16} flexDirection='row' alignItems='flex-start' justifyContent='space-between'>
            <Typography style={styles.full} type='headline' size='small'>
              {t('room.roomBeingRecorded')}
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
            {t('room.roomBeingRecordedMessage')}
          </Typography>
          <Flex
            style={styles.buttonContainer}
            flexDirection='row'
            gap={6}
            alignItems='flex-start'
            justifyContent='space-between'
          >
            <Button type='cancel' style={styles.full} text={t('room.leaveRoom')} onPress={handleLeaveRoom} />
            <Button style={styles.full} text={t('common.iUnderstand')} onPress={closeModal} />
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default RoomBeingRecorded;

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
