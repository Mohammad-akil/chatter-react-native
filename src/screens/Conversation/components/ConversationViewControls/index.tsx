import { useMutation } from '@tanstack/react-query';
import { Dispatch, FC, SetStateAction, memo, useCallback, useEffect, useState } from 'react';

import { StyleSheet } from 'react-native';
import { FadeInDown, FadeOutDown, SequencedTransition } from 'react-native-reanimated';
import { api } from '~/api';
import { ConversationContent } from '~/entities/Conversations';
import ReactionButton from '~/screens/Room/components/RoomControls/ReactionButton';
import { colorPalette } from '~/styles/colors';
import { AnimatedFlex } from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import { normalize } from '~/utils/normalize';

interface ConversationViewControlsProps {
  conversationId: string;
  liked: boolean;
  playAudioInSequence?: (currIndex?: number) => Promise<void>;
  activeTab: number | undefined;
  conversationContent: ConversationContent[];
  selectPart?: (index: number) => void;
  setLikesCounter: Dispatch<SetStateAction<number>>;
}

const ConversationViewControls: FC<ConversationViewControlsProps> = ({
  conversationId,
  liked,
  activeTab,
  conversationContent,
  selectPart,
  setLikesCounter,
}) => {
  const [like, setLike] = useState(liked);

  const likeConversation = useMutation({
    mutationFn: (id: string) => api.conversations.likeConversation(id),
  });
  const removeLike = useMutation({
    mutationFn: (id: string) => api.conversations.removeLike(id),
  });
  const handleToggleLike = useCallback(() => {
    if (like) {
      removeLike.mutate(conversationId);
      setLikesCounter((prev) => prev - 1);
    } else {
      likeConversation.mutate(conversationId);
      setLikesCounter((prev) => prev + 1);
    }
  }, [conversationId, like, likeConversation, removeLike, setLikesCounter]);

  useEffect(() => {
    if (removeLike.isSuccess) {
      setLike(false);
      removeLike.reset();
    } else if (likeConversation.isSuccess) {
      setLike(true);
      likeConversation.reset();
    }
  }, [likeConversation, likeConversation.isSuccess, removeLike, removeLike.isSuccess]);

  const playNextPart = useCallback(() => {
    if ((selectPart && activeTab) || (selectPart && activeTab === 0)) {
      selectPart(activeTab + 1);
    }
  }, [activeTab, selectPart]);

  const playPrevPart = useCallback(() => {
    if (selectPart && activeTab) {
      selectPart(activeTab - 1);
    }
  }, [activeTab, selectPart]);

  return (
    <AnimatedFlex
      layout={SequencedTransition.duration(100)}
      entering={FadeInDown}
      exiting={FadeOutDown}
      justifyContent='center'
      flexDirection='row'
      alignItems='center'
      gap={2}
      style={bottomControls.container}
    >
      <IconButton
        size='3xl'
        iconName={'play-skip-back'}
        disabled={activeTab === 0 ? true : false}
        onPress={playPrevPart}
      />
      <ReactionButton />
      <IconButton
        size='3xl'
        colorOfIcon={like ? colorPalette.error500 : undefined}
        iconName={like ? 'heart' : 'heart-outline'}
        onPress={handleToggleLike}
      />
      <IconButton
        size='3xl'
        iconName={'play-skip-forward'}
        disabled={activeTab === conversationContent.length - 1 ? true : false}
        onPress={playNextPart}
      />
    </AnimatedFlex>
  );
};
const bottomControls = StyleSheet.create({
  header: {
    paddingVertical: normalize(10),
  },
  container: {
    paddingBottom: normalize(14),
    paddingTop: normalize(12),
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

export default memo(ConversationViewControls);
