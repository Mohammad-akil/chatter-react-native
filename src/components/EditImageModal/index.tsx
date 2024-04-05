import React, { Dispatch, SetStateAction, memo, useCallback } from 'react';
import { Modal, StyleSheet, useWindowDimensions } from 'react-native';
import { colorPalette } from '~/styles/colors';
import { normalize } from '~/utils/normalize';
import { useTranslation } from 'react-i18next';
import Flex from '~/ui/Flex';
import Button from '~/ui/Button';

interface IEditImageModal {
  choosePhotoFunc: () => Promise<void>;
  removePhotoFunc: () => Promise<void>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isModalOpen: boolean;
}

const EditImageModal: React.FC<IEditImageModal> = ({
  choosePhotoFunc,
  removePhotoFunc,
  setIsModalOpen,
  isModalOpen,
}) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const modalWidth = { width: width - normalize(36) };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  return (
    <Modal key='editImageModal' animationType='fade' transparent visible={isModalOpen} onRequestClose={closeModal}>
      <Flex flex={1} justifyContent='flex-end' alignItems='center' style={styles.modalContainer}>
        <Flex gap={6} style={[styles.generalContainer, modalWidth]}>
          <Button
            text={t('common.remove')}
            type='report'
            size='lg'
            onPress={removePhotoFunc}
            style={styles.removeButton}
          />
          <Button text={t('common.choosePhoto')} type='secondary' size='lg' onPress={choosePhotoFunc} />

          <Button text={t('common.cancel')} type='secondary' size='lg' onPress={closeModal} />
        </Flex>
      </Flex>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: normalize(44),
  },
  generalContainer: {
    backgroundColor: colorPalette.grey750,
    padding: normalize(16),
    borderRadius: 6,
    marginBottom: 4,
    maxHeight: 200,
  },

  removeButton: {
    borderWidth: 0,
  },
});

export default memo(EditImageModal);
