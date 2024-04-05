import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import ConversationMenu from '../../ConversationMenu';
import IconButton from '~/ui/IconButton';
import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { ConversationViewTypes } from '~/entities/Conversations';

const HeaderControls = ({
  conversationData,
  type,
  lastUserReply,
}: {
  conversationData: ConversationViewTypes | undefined;
  type: 'owner' | 'viewer' | 'reply';
  lastUserReply: string | undefined;
}) => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  return (
    <Flex flexDirection='row'>
      <Flex flex={1} justifyContent='center'>
        {type === 'owner' ? (
          <Typography type='headline' size='small' color='grey300'>
            {t('conversations.newConversation')}
          </Typography>
        ) : (
          <Typography type='headline' size='small' numberOfLines={2}>
            {conversationData?.title}
          </Typography>
        )}
      </Flex>
      <Flex flexDirection='row' gap={4} alignItems='center'>
        {type !== 'owner' ? (
          <ConversationMenu conversation={conversationData} lastUserReply={lastUserReply} />
        ) : (
          <IconButton type='text' disabled size='md' iconName='ellipsis-horizontal' />
        )}
        <IconButton iconName='share-outline' type='secondary' disabled={type !== 'owner' ? false : true} size='md' />
        <IconButton
          iconName='close-outline'
          type='secondary'
          size='md'
          onPress={() => {
            navigate('Drawer');
          }}
        />
      </Flex>
    </Flex>
  );
};
export default memo(HeaderControls);
