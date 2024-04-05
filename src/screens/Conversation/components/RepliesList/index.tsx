import { FC, memo, useCallback, useRef } from 'react';
import { FlatList, ListRenderItem, StyleSheet, TouchableOpacity } from 'react-native';
import { ConversationContent, ConversationViewTypes } from '~/entities/Conversations';
import { colorPalette } from '~/styles/colors';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';

interface RepliesListProps {
  conversationData: ConversationViewTypes;
  currentAudio: number;
  type: 'viewer' | 'reply';
  selectPart: (index: number) => void;
}

const RepliesList: FC<RepliesListProps> = ({ conversationData, currentAudio, type, selectPart }) => {
  const flatListRef = useRef<FlatList | null>(null);
  const scrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  const renderRow: ListRenderItem<ConversationContent> = useCallback(
    ({ item, index }) => {
      const lastItem = conversationData?.content.length - 1;
      const itemMargin = { marginTop: index % 2 === 0 ? normalize(100) : -normalize(100) };
      const activeBorder = {
        borderColor:
          (index === currentAudio && currentAudio) || (index === currentAudio && currentAudio === 0)
            ? colorPalette.primary400
            : 'transparent',
      };
      const shade = conversationData && type === 'reply';
      const opacity = { opacity: shade && index !== lastItem ? 0.5 : 1 };
      const reply =
        type === 'reply' && conversationData && index === lastItem
          ? {
              ...styles.mainAvatar,
              borderStyle: 'dashed',
            }
          : {};
      if (conversationData?.content.length === 1) {
        return (
          <>
            {type === 'viewer' ? (
              <TouchableOpacity style={[styles.mainAvatar, activeBorder]} onPress={() => selectPart(index)}>
                <Avatar url={item.user.avatar} style={opacity} size={120} />
              </TouchableOpacity>
            ) : (
              <Flex style={[styles.mainAvatar, activeBorder, reply]}>
                <Avatar url={item.user.avatar} style={opacity} size={120} />
              </Flex>
            )}
          </>
        );
      }

      return (
        <Flex justifyContent='center'>
          <Flex justifyContent='center' style={itemMargin}>
            {type === 'viewer' ? (
              <TouchableOpacity style={[styles.mainAvatar, activeBorder]} onPress={() => selectPart(index)}>
                <Avatar url={item.user.avatar} style={opacity} size={80} />
              </TouchableOpacity>
            ) : (
              <Flex style={[styles.mainAvatar, activeBorder, reply]}>
                <Avatar url={item.user.avatar} style={opacity} size={80} />
              </Flex>
            )}
          </Flex>
        </Flex>
      );
    },
    [conversationData, currentAudio, selectPart, type],
  );
  return (
    <FlatList
      data={conversationData.content}
      horizontal
      scrollEnabled={conversationData?.content.length < 6 ? false : true}
      showsHorizontalScrollIndicator={false}
      renderItem={renderRow}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.flatListContainer}
      onContentSizeChange={scrollToBottom}
    />
  );
};

const styles = StyleSheet.create({
  mainAvatar: { borderRadius: 360, padding: 5, borderColor: colorPalette.primary400, borderWidth: 2 },
  flatListContainer: { gap: -normalize(40) },
});

export default memo(RepliesList);
