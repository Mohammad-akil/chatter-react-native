import { Dispatch, FC, SetStateAction, memo, useCallback, useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';

import { colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';
import { TextInput } from '~/ui/TextInput';
import Toast from 'react-native-toast-message';
import { CustomToastProps } from '~/ui/Toast/types';

interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setLink?: Dispatch<SetStateAction<string | undefined>>;
  successButtonText: string;
  title: string;
  placeholder: string;
  handleSetTitle?: (title: string) => void;
}

const ConversationModal: FC<ModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  placeholder,
  successButtonText,
  title,
  setLink,
  handleSetTitle,
}) => {
  const { t } = useTranslation();

  const [modalHeight, setModalHeight] = useState<number>(0);
  const { height } = useWindowDimensions();
  const [inputValue, setInputValue] = useState('');

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const onModalLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setModalHeight(height);
  };

  const isValidUrl = (url: string) => {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return urlRegex.test(url);
  };

  const handleChangeText = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleSuccsesButton = useCallback(() => {
    if (setLink) {
      if (isValidUrl(inputValue)) {
        setLink(inputValue);
        setIsModalOpen(false);
        Toast.show({
          type: 'normal',
          text1: 'Link successful added',
        } as CustomToastProps);
      } else {
        setIsModalOpen(false);
        setLink('');
        Toast.show({
          type: 'error',
          text1: 'Not added. Link is invalid.',
        } as CustomToastProps);
      }
    } else {
      if (handleSetTitle) {
        handleSetTitle(inputValue);
        setIsModalOpen(false);
      }
    }
  }, [handleSetTitle, inputValue, setIsModalOpen, setLink]);

  const positionOfModal = { top: height / 2 - modalHeight / 2 };
  return (
    <Modal
      key='newConversationModal'
      animationType='fade'
      transparent={true}
      visible={isModalOpen}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalBackground} />
      </TouchableWithoutFeedback>
      <View style={[styles.modalView, positionOfModal]} onLayout={onModalLayout}>
        <Flex gap={2}>
          <Typography type='label' size='medium'>
            {title}
          </Typography>
          <TextInput
            placeholder={placeholder}
            autoCapitalize='none'
            withBorder
            value={inputValue}
            onChangeText={handleChangeText}
          />
        </Flex>
        <Flex flexDirection='row' gap={6}>
          <Flex flex={1}>
            <Button type='cancel' text={t('common.cancel')} onPress={closeModal} />
          </Flex>
          <Flex flex={1}>
            <Button text={successButtonText} disabled={!inputValue.trim()} onPress={handleSuccsesButton} />
          </Flex>
        </Flex>
      </View>
    </Modal>
  );
};

export default memo(ConversationModal);

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
