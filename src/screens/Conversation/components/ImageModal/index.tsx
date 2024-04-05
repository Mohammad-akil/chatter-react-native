import { Dispatch, FC, SetStateAction, memo, useCallback, useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native';
import { colors } from '~/styles/colors';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import { normalize } from '~/utils/normalize';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Skeleton from '~/ui/Skeleton';

interface ImageModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  image: string | null;
}

const ModalContent = gestureHandlerRootHOC(
  ({ imageUri, setIsLoading }: { imageUri: string | null; setIsLoading: Dispatch<SetStateAction<boolean>> }) => (
    <ImageZoom
      onLoadEnd={() => {
        setIsLoading(false);
      }}
      resizeMode='cover'
      style={styles.image}
      //@ts-ignore
      uri={imageUri}
    />
  ),
);

const ImageModal: FC<ImageModalProps> = ({ isModalOpen, setIsModalOpen, image }) => {
  const { height, width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const positionOfModal = { left: width / 2 - normalize(100), top: height / 2 - normalize(100) };
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

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
      <Flex style={styles.closeButton}>
        <IconButton size='md' iconName='close-outline' onPress={closeModal} />
      </Flex>
      {isLoading && <Skeleton width={200} height={200} borderRadius={6} style={positionOfModal} />}
      <View style={[styles.modalView, positionOfModal]}>
        <ModalContent setIsLoading={setIsLoading} imageUri={image} />
      </View>
    </Modal>
  );
};

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
  image: { borderRadius: 6 },
  closeButton: { position: 'absolute', right: normalize(20), top: normalize(65) },
  modalView: {
    maxWidth: normalize(200),
    maxHeight: normalize(200),
    flex: 1,
  },
});

export default memo(ImageModal);
