import { memo, useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ConversationViewTypes } from '~/entities/Conversations';
import { normalize } from '~/utils/normalize';
import ImageModal from '../ImageModal';

const ImageComponent = ({
  conversationData,
  currentPartIndex,
}: {
  conversationData: ConversationViewTypes;
  currentPartIndex: number;
}) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  const openImageHandle = useCallback(() => {
    setIsImageOpen(true);
  }, []);

  return (
    <>
      <TouchableOpacity onPress={openImageHandle} style={styles.imageContainer}>
        <FastImage
          style={styles.imageStyle}
          //@ts-ignore
          source={{ uri: conversationData.content[currentPartIndex].content.image }}
        />
      </TouchableOpacity>
      {isImageOpen && (
        <ImageModal
          image={conversationData.content[currentPartIndex].content.image}
          isModalOpen={isImageOpen}
          setIsModalOpen={setIsImageOpen}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: { justifyContent: 'center', alignItems: 'center' },
  imageStyle: { minWidth: normalize(80), minHeight: normalize(80), flex: 1, borderRadius: 6 },
});

export default memo(ImageComponent);
