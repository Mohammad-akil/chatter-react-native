import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { memo, useCallback, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { ReadyConversationTypes } from '~/entities/Conversations';
import { RootStackParamList } from '~/navigation';
import Flex from '~/ui/Flex';
import ConversationView from '../ConversationView';
import { commonStyles } from '~/styles';
import { useNavigation } from '@react-navigation/native';

const ConversationsCarousel = ({ route }: NativeStackScreenProps<RootStackParamList, 'ConversationsCarousel'>) => {
  const { width, height } = useWindowDimensions();
  const { navigate } = useNavigation();
  const { conversations, index } = route.params;
  const [currentIndex, setCurrentIndex] = useState<number>();
  const carouselRef = useRef<ICarouselInstance>(null);

  const onProgressChange = useCallback(() => {
    const index = carouselRef?.current?.getCurrentIndex();
    setCurrentIndex(index);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: ReadyConversationTypes; index: number }) => {
      const playNextConversation = () => {
        if (index || index === 0) {
          if (conversations && index === conversations?.length - 1) {
            return navigate('Drawer');
          } else {
            carouselRef.current?.scrollTo({ index: index + 1 });
          }
        }
      };

      return (
        <ConversationView
          playNextConversation={playNextConversation}
          currentIndex={currentIndex}
          indexOfElement={index}
          conversationId={item.id}
        />
      );
    },
    [conversations, currentIndex, navigate],
  );

  if (conversations) {
    return (
      <Flex style={commonStyles.baseSafeArea}>
        <Carousel
          ref={carouselRef}
          loop={false}
          width={width}
          height={height}
          data={conversations}
          scrollAnimationDuration={300}
          defaultIndex={index}
          renderItem={renderItem}
          onProgressChange={onProgressChange}
        />
      </Flex>
    );
  }
};

export default memo(ConversationsCarousel);
