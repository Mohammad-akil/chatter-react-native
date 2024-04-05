import { Dispatch, FC, SetStateAction, memo, useCallback } from 'react';
import { Modal, StyleSheet, useWindowDimensions } from 'react-native';
import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';

interface ISettingsModal {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  title: string;
  subtitle: string;
}

const SettingsModal: FC<ISettingsModal> = ({ isModalOpen, setIsModalOpen, logout, title, subtitle }) => {
  const { width } = useWindowDimensions();
  const modalWidth = { width: width - normalize(32) };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  return (
    <Modal key='actionButton' visible={isModalOpen} animationType='fade' transparent={true}>
      <Flex flex={1} justifyContent='center' alignItems='center' style={styles.modalContainer}>
        <Flex gap={8} style={[styles.generalContainer, modalWidth]}>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='headline' size='small'>
              {title}
            </Typography>
            <IconButton
              size='lg'
              type='text'
              iconName='close-outline'
              style={commonStyles.zeroPadding}
              onPress={closeModal}
            />
          </Flex>
          <Flex>
            <Typography size='default' type='body'>
              {subtitle}
            </Typography>
          </Flex>
          <Flex flexDirection='row' gap={6} style={styles.buttonContainer}>
            <Flex flex={1}>
              <Button text='Cancel' type='ghost' onPress={closeModal} />
            </Flex>
            <Flex flex={1}>
              <Button text='Log out' type='red' onPress={logout} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  generalContainer: {
    backgroundColor: colorPalette.grey750,
    padding: normalize(16),
    borderRadius: 6,
  },
  buttonContainer: { paddingTop: 8 },
});

export default memo(SettingsModal);
