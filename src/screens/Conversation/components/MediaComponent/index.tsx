import { FC, memo } from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { colorPalette } from '~/styles/colors';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import ImageComponent from '../ImageComponent';
import ConversationLinkComponent from '../ConversationLinkComponent';
import { ConversationContent, ConversationViewTypes } from '~/entities/Conversations';
interface MediaContainerComponentProps {
  conversationData: ConversationViewTypes;
  type: 'reply' | 'viewer';
  currentAudio: number;
  activePart: ConversationContent | undefined;
  imageUriValue: string | undefined;
  deleteImage: () => void;
}

const MediaContainerComponent: FC<MediaContainerComponentProps> = ({
  conversationData,
  type,
  currentAudio,
  activePart,
  imageUriValue,
  deleteImage,
}) => {
  const { width } = useWindowDimensions();

  const linkComponentWidth =
    currentAudio !== -1
      ? conversationData.content[currentAudio].content.image
        ? { width: width - normalize(116) }
        : { width: width - normalize(36) }
      : {};

  return (
    <AnimatedFlex
      exiting={FadeOut}
      entering={FadeIn}
      layout={LinearTransition.duration(400)}
      flexDirection='row'
      justifyContent='center'
      gap={10}
      style={styles.mediaContainer}
    >
      {type !== 'reply' && conversationData.content[currentAudio].content?.image && activePart && (
        <ImageComponent currentPartIndex={currentAudio} conversationData={conversationData} />
      )}
      {type !== 'reply' && conversationData.content[currentAudio].content.link && activePart && (
        <Flex alignItems='center' justifyContent='center' style={linkComponentWidth}>
          <ConversationLinkComponent currentPartIndex={currentAudio} conversationData={conversationData} />
        </Flex>
      )}
      {imageUriValue && (
        <Animated.View
          style={styles.imageContainer}
          layout={LinearTransition.duration(400)}
          exiting={FadeOut}
          entering={FadeIn}
        >
          <TouchableOpacity style={styles.imageCloseButton} onPress={deleteImage}>
            <Icon name='trash-outline' color={colorPalette.white} size={16} />
          </TouchableOpacity>
          <FastImage source={{ uri: imageUriValue }} style={styles.imageStyle} />
        </Animated.View>
      )}
    </AnimatedFlex>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(10),
    minHeight: normalize(80),
  },
  imageContainer: { alignSelf: 'center', paddingBottom: normalize(15) },
  imageCloseButton: {
    position: 'absolute',
    right: 2,
    top: 2,
    zIndex: 20,
    padding: 8,
    backgroundColor: 'rgba(56.82, 55.07, 51.79, 0.50)',
    borderRadius: 44,
  },
  imageStyle: { width: normalize(88), height: normalize(88), borderRadius: 9.5 },
});

export default memo(MediaContainerComponent);
