import { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';
import { ConversationType } from '~/entities/DirectMessages';
interface IConversation {
  item: ConversationType;
  swipeAnimations: ConversationType[];
}
export const Conversation: FC<IConversation> = memo(({ item, swipeAnimations }) => {
  const { navigate } = useNavigation();
  const animatedStyles = {
    ...styles.conversationContainer,
    //@ts-ignore
    transform: [{ translateX: swipeAnimations[item.dmBoxId] }],
  };
  const arr: string[] = [];
  useEffect(() => {
    item?.boxUsers.map((user: any) => {
      arr.push(user.first_name);
    });
  });

  const content = useMemo(() => {
    return item.boxUsers.map((user, index) => {
      if (index === item.boxUsers?.length - 1) {
        return `${user.first_name} ${user.last_name}`;
      }
      return `${user.first_name} ${user.last_name}, `;
    });
  }, [item.boxUsers]);

  const goToChat = useCallback(async () => {
    const arr: string[] = [];
    item?.boxUsers.map((user: any) => {
      arr.push(user.first_name);
    });
    navigate('DMThread', {
      chatId: item.dmBoxId,
      boxUsers: arr,
    });
  }, [item?.boxUsers, item.dmBoxId, navigate]);

  const getContent = (item: ConversationType) => {
    switch (item.latestMessage?.type) {
      case 'text':
        return item.latestMessage?.content;
      case 'gif':
        return 'GIF';
      case 'image':
        return 'IMAGE';
      case 'imageText':
        return item.latestMessage?.content.text;
      default:
        return '';
    }
  };

  const result = getContent(item);

  return (
    <TouchableOpacity activeOpacity={1} key={item.dmBoxId} onPress={goToChat}>
      <Animated.View style={animatedStyles}>
        <Flex flexDirection='row' alignItems='center' gap={4}>
          <Avatar url={item?.boxUsers?.[0]?.avatar} size={52} />
          <Flex style={styles.conversationNameContainer}>
            <Typography style={styles.conversationPadding} type='body' size='medium' numberOfLines={1}>
              {content}
            </Typography>

            <Typography style={styles.conversationPadding} color='grey300' type='label' size='small' numberOfLines={1}>
              {result}
            </Typography>
          </Flex>
        </Flex>
        <Flex flexDirection='row' gap={7} alignItems='center' style={styles.indicatorPadding}>
          <Flex style={styles.lastMessageTimeContainer}>
            <Typography type='label' size='small'>
              {item.latestMessage?.created}
            </Typography>
          </Flex>
          {/* {!item.latestMessage && <Flex style={styles.unreadIndicator} />} */}
        </Flex>
      </Animated.View>
    </TouchableOpacity>
  );
});

export const styles = StyleSheet.create({
  conversationContainer: {
    marginBottom: normalize(18),
    backgroundColor: colorPalette.grey850,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conversationNameContainer: {
    maxWidth: normalize(260),
  },
  lastMessageTimeContainer: {
    minWidth: normalize(22),
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 20,
    backgroundColor: colorPalette.warning300,
  },
  conversationPadding: {
    padding: 4,
  },
  indicatorPadding: { paddingRight: 4 },
});
