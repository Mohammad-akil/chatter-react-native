import { FC, memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ConversationContent, ConversationViewTypes } from '~/entities/Conversations';
import { progress } from '~/hooks/useSlider/styles';
import { useStorageUser } from '~/services/mmkv/auth';
import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import HeaderControls from './HeaderControls';
import GeneralConversationInfo from './GeneralConversationInfo';
import { AudioTypes } from '~/hooks/useAudioRecorder/types';
interface ConversationHeaderProps {
  type: 'owner' | 'viewer' | 'reply';
  activeTab?: number;
  activePart?: ConversationContent;
  conversationData?: ConversationViewTypes;
  audio?: AudioTypes;
  likesCounter?: number | undefined;
}
const ConversationHeader: FC<ConversationHeaderProps> = ({
  type = 'owner',
  conversationData,
  activeTab,
  activePart,
  audio,
  likesCounter,
}) => {
  const [user] = useStorageUser();
  const [lastUserReply, setLastUserReply] = useState<string>();

  useEffect(() => {
    conversationData?.content.map((item, index) => {
      if (item.user.id === user?.id && index !== 0) {
        setLastUserReply(item.id);
      }
    });
  }, [conversationData?.content, user?.id]);

  const renderTab = useCallback(
    (index: number) => {
      const viewerStyle = index === activeTab ? [progress.base, progress.active] : progress.base;
      const isLastItem = conversationData && index === conversationData?.content.length - 1;
      const newPartStyle = { backgroundColor: colorPalette.primary400 };

      const replyStyle =
        isLastItem && audio
          ? [progress.base, newPartStyle]
          : isLastItem
            ? [progress.base, progress.active]
            : progress.base;

      return <Flex key={index} style={type === 'reply' ? replyStyle : viewerStyle} />;
    },
    [activeTab, audio, conversationData, type],
  );

  const headerPadding = type !== 'owner' ? commonStyles.baseScreenPadding : {};

  return (
    <Flex gap={8} style={[header.headerContainer, headerPadding]}>
      <HeaderControls conversationData={conversationData} type={type} lastUserReply={lastUserReply} />
      <GeneralConversationInfo
        conversationData={conversationData}
        type={type}
        renderTab={renderTab}
        activePart={activePart}
        likesCounter={likesCounter}
      />
    </Flex>
  );
};
const header = StyleSheet.create({
  headerContainer: { paddingVertical: 6 },
  pagination: {
    flexDirection: 'row',
    gap: 10,
    marginTop: normalize(12),
  },
});

export default memo(ConversationHeader);
