import { FC, memo, useCallback, useEffect } from 'react';
import { ListRenderItemInfo, StyleSheet, TouchableOpacity } from 'react-native';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import Typography from '~/ui/Typography';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { Conversation } from '../Conversation';
import { useSwipeDeleteAnimation } from '../../hooks/useSwipeDeleteAnimation';
import { ConversationsListProps, EmptyConversationProps } from './types';

import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';
import { commonStyles } from '~/styles';
import { ConversationType } from '~/entities/DirectMessages';
import { api } from '~/api';
import { useMutation } from '@tanstack/react-query';

const EmptyConversation: React.FC<EmptyConversationProps> = memo(({ goToNewMessage }) => {
  const { t } = useTranslation();
  return (
    <Flex flex={1} justifyContent='center' alignItems='center' style={styles.emptyListContainer}>
      <Typography type='headline' size='default'>
        {t('messages.nothing')}
      </Typography>
      <Button type='link' text={t('messages.create')} size='md' onPress={goToNewMessage} />
    </Flex>
  );
});

const ConversationsList: FC<ConversationsListProps> = ({
  conversationsList,
  setConversationsList,
  swipeAnimations,
}) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const goToNewMessage = useCallback(() => {
    navigate('NewMessage');
  }, [navigate]);
  const swipeDeleteAnimation = useSwipeDeleteAnimation();

  const { data, mutate, isSuccess } = useMutation({
    mutationFn: (itemId: string) => api.directMessages.deleteConversation(itemId),
  });

  const conversationsRenderItem = useCallback(
    ({ item }: ListRenderItemInfo<ConversationType>) => {
      return <Conversation key={item.dmBoxId} item={item} swipeAnimations={swipeAnimations} />;
    },
    [swipeAnimations],
  );

  const deleteHandle = useCallback(
    (itemId: string) => {
      swipeDeleteAnimation(swipeAnimations[itemId], -500, 250, () => {
        mutate(itemId);
      });
    },
    [mutate, swipeAnimations, swipeDeleteAnimation],
  );

  const renderSwipeMenuItem = useCallback(
    ({ item }: { item: ConversationType }) => {
      const animatedStyles = {
        ...styles.backRightBtn,
        transform: [{ translateX: swipeAnimations[item.dmBoxId] }],
      };
      const deleteConversation = () => {
        deleteHandle(item.dmBoxId);
      };
      return (
        <TouchableOpacity key={item.dmBoxId} style={animatedStyles} onPress={deleteConversation}>
          <Icon size={normalize(24)} color={'white'} name='trash-outline' />
        </TouchableOpacity>
      );
    },
    [deleteHandle, swipeAnimations],
  );

  useEffect(() => {
    isSuccess && setConversationsList(data.data);
  }, [isSuccess, setConversationsList, data]);

  if (conversationsList?.length < 1 || conversationsList === undefined) {
    return <EmptyConversation goToNewMessage={goToNewMessage} />;
  }

  return (
    <Flex style={styles.container}>
      <Flex alignItems='flex-start' style={styles.headlineContainer}>
        <Typography type='headline' size='default'>
          {t('common.conversationsCount', { number: conversationsList?.length })}
        </Typography>
      </Flex>
      <Flex>
        <SwipeListView
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={conversationsList}
          renderItem={conversationsRenderItem}
          renderHiddenItem={renderSwipeMenuItem}
          rightOpenValue={normalize(-62)}
          disableRightSwipe
          closeOnRowPress={true}
          keyExtractor={(item) => item.dmBoxId.toString()}
        />
      </Flex>
    </Flex>
  );
};

export const styles = StyleSheet.create({
  container: {
    ...commonStyles.baseScreenPadding,
    paddingBottom: normalize(100),
  },
  headlineContainer: {
    paddingBottom: normalize(32),
  },
  emptyListContainer: {
    paddingTop: normalize(160),
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: normalize(52),
    height: normalize(52),
    backgroundColor: colorPalette.error600,
    right: 0,
  },
});

export default memo(ConversationsList);
