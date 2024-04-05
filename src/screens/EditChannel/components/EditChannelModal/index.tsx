import { Dispatch, FC, SetStateAction, memo, useCallback } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';

import { colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

interface ModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  setFromModal: Dispatch<SetStateAction<boolean>>;
}

const EditChannelModal: FC<ModalProps> = ({ isVisible, setIsVisible, setFromModal }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const saveChanges = useCallback(() => {
    setIsVisible(false);
    setFromModal(true);
  }, [setFromModal, setIsVisible]);

  const handleLeaveRoom = useCallback(() => {
    setIsVisible(false);
    navigate('Drawer');
  }, [navigate, setIsVisible]);

  return (
    <Modal
      key='editChannelModal'
      animationType='fade'
      transparent={true}
      visible={isVisible}
      onRequestClose={saveChanges}
    >
      <Flex style={styles.modalBackground} justifyContent='center' alignItems='center' flex={1}>
        <Flex style={styles.modalView} gap={8}>
          <Flex gap={16} flexDirection='row' alignItems='flex-start' justifyContent='space-between'>
            <Typography style={styles.full} type='headline' size='small'>
              {t('common.unsavedChanges')}
            </Typography>
          </Flex>
          <Typography type='body' size='default'>
            {t('common.notSaveChanges')}
          </Typography>
          <Flex
            style={styles.buttonContainer}
            flexDirection='row'
            gap={6}
            alignItems='flex-start'
            justifyContent='space-between'
          >
            <Button type='cancel' style={styles.full} text={t('common.iUnderstand')} onPress={handleLeaveRoom} />
            <Button style={styles.full} text={t('common.saveChanges')} onPress={saveChanges} />
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default memo(EditChannelModal);

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
