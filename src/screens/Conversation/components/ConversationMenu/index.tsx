import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableHighlight } from 'react-native';
import Popover from 'react-native-popover-view/dist/Popover';
import { api } from '~/api';
import { ConversationViewTypes } from '~/entities/Conversations';
import { useStorageUser } from '~/services/mmkv/auth';
import { commonPopover } from '~/styles';
import { colors } from '~/styles/colors';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';

const ConversationMenu = ({
  conversation,
  lastUserReply,
}: {
  conversation: ConversationViewTypes | undefined;
  lastUserReply: string | undefined;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const [user] = useStorageUser();
  const { navigate } = useNavigation();
  const popoverAnimation = { duration: 300 };

  const deletePart = useMutation({
    mutationFn: (id: string | undefined) => api.conversations.deleteReplyPart(id),
  });

  const deleteConversation = useMutation({
    mutationFn: (id: string | undefined) => api.conversations.deleteConversation(id),
  });

  const popoverStyle = [
    commonPopover.base,
    commonPopover.noBackground,
    { transform: [{ translateX: -80 }, { translateY: 5 }] },
  ];

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    deletePart.isSuccess && navigate('Drawer');
  }, [deletePart.isSuccess, navigate]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  const handleDeleteConversation = useCallback(() => {
    deleteConversation.mutate(conversation?.id);
    setIsMenuOpen(false);
  }, [conversation?.id, deleteConversation]);

  const handleDeleteReplyPart = useCallback(() => {
    deletePart.mutate(lastUserReply);
    setIsMenuOpen(false);
  }, [deletePart, lastUserReply]);

  return (
    <Popover
      isVisible={isMenuOpen}
      onRequestClose={closeMenu}
      arrowSize={commonPopover.arrow}
      popoverStyle={popoverStyle}
      animationConfig={popoverAnimation}
      backgroundStyle={commonPopover.noBackground}
      offset={2}
      from={
        <IconButton type='text' active={isMenuOpen} size='md' iconName='ellipsis-horizontal' onPress={toggleMenu} />
      }
    >
      <Flex style={dropdown.base}>
        <TouchableHighlight underlayColor={colors.surface.surfaceComponent} onPress={closeMenu} style={dropdown.item}>
          <Typography numberOfLines={1}>{t('common.shareFeedback')}</Typography>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={colors.surface.surfaceComponent} onPress={closeMenu} style={dropdown.item}>
          <Typography numberOfLines={1}>{t('common.report')}</Typography>
        </TouchableHighlight>
        {conversation?.content[0].user.id === user?.id && (
          <TouchableHighlight
            underlayColor={colors.surface.surfaceComponent}
            onPress={handleDeleteConversation}
            style={dropdown.item}
          >
            <Typography color='error400' numberOfLines={1}>
              {t('common.deleteConversation')}
            </Typography>
          </TouchableHighlight>
        )}
        {lastUserReply && (
          <TouchableHighlight
            underlayColor={colors.surface.surfaceComponent}
            onPress={handleDeleteReplyPart}
            style={dropdown.item}
          >
            <Typography color='error400' numberOfLines={1}>
              {t('common.deleteMyPart')}
            </Typography>
          </TouchableHighlight>
        )}
      </Flex>
    </Popover>
  );
};

const dropdown = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.buttonDefaultNormal,
    padding: 4,
    alignSelf: 'baseline',
    width: 200,
  },
  item: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
});
export default memo(ConversationMenu);
