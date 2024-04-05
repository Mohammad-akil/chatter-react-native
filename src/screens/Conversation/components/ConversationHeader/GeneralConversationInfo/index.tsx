import { memo } from 'react';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import Icon from 'react-native-vector-icons/Ionicons';
import { colorPalette } from '~/styles/colors';
import { useStorageUser } from '~/services/mmkv/auth';
import { ConversationContent, ConversationViewTypes } from '~/entities/Conversations';
import { StyleSheet } from 'react-native';
import { normalize } from '~/utils/normalize';

const GeneralConversationInfo = ({
  conversationData,
  type,
  activePart,
  renderTab,
  likesCounter,
}: {
  conversationData: ConversationViewTypes | undefined;
  type: 'owner' | 'viewer' | 'reply';
  activePart: ConversationContent | undefined;
  renderTab: (index: number) => JSX.Element;
  likesCounter: number | undefined;
}) => {
  const [user] = useStorageUser();
  return (
    <>
      <Flex flexDirection='row' gap={4} alignItems='center'>
        {type === 'owner' ? (
          <>
            <Avatar url={user?.avatar} size={24} />
            <Typography type='label' size='small'>
              {user?.first_name} {user?.last_name}
            </Typography>
          </>
        ) : (
          <>
            <Avatar url={conversationData?.content[0].user.avatar} size={24} />
            <Typography type='label' size='small'>
              {conversationData?.content[0].user.first_name} {conversationData?.content[0].user.last_name}
            </Typography>
          </>
        )}
      </Flex>
      {type !== 'owner' && (
        <>
          <Flex style={header.pagination}>{conversationData?.content.map((_, index) => renderTab(index))}</Flex>
          <Flex justifyContent='space-between' flexDirection='row'>
            <Typography type='label' size='small' color='grey300'>
              {conversationData?.updated}
            </Typography>
            <Typography type='label' size='small' color='grey300'>
              {
                //@ts-ignore
                !!activePart?.duration && Math.round(activePart?.duration) + 's'
              }
            </Typography>
          </Flex>
        </>
      )}
      <Flex gap={12} flexDirection='row'>
        <Flex flexDirection='row' gap={4} alignItems='center'>
          <Icon name='eye' size={16} color={colorPalette.white} />
          {type === 'owner' ? <Typography>0</Typography> : <Typography>{conversationData?.views}</Typography>}
        </Flex>
        <Flex flexDirection='row' gap={4} alignItems='center'>
          <Icon name='heart' size={16} color={colorPalette.white} />
          {type === 'owner' ? <Typography>0</Typography> : <Typography>{likesCounter}</Typography>}
        </Flex>
      </Flex>
    </>
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

export default memo(GeneralConversationInfo);
