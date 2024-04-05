import { type FC, memo, useRef, useState } from 'react';
import {
  type StyleProp,
  type ViewStyle,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';

import { colorPalette, colors } from '~/styles/colors';
import { commonStyles } from '~/styles';

import Flex, { AnimatedFlex } from '~/ui/Flex';
import Typography from '~/ui/Typography';

import { normalize } from '~/utils/normalize';
import { TextInput } from '~/ui/TextInput';
import IconButton from '~/ui/IconButton';

import Contribute from '../../components/Contribute';

import { ChatMessage } from '../../components/RoomChat/ChatMessage';
import { ChatHeader } from '../../components/RoomChat/ChatHeader';
import { RoomChatMessage } from '~/entities/Message';

import Button from '~/ui/Button';

import ChatterIcon from '~/ui/ChatterIcon';
import { useChat } from '../../hooks/useChat';
import ContributionProcessModal from '../../components/ContributionProcessModal';
import Avatar from '~/ui/Avatar';
import { useTranslation } from 'react-i18next';

import { useRecoilState } from 'recoil';
import { chatMessagesState } from '../../state/chatState';

type ChatProps = {
  style?: StyleProp<ViewStyle>;
};

const viewabilityConfig = { viewAreaCoveragePercentThreshold: 0, waitForInteraction: true };

const Chat: FC<ChatProps> = () => {
  const { t } = useTranslation();
  const [chatMessages] = useRecoilState(chatMessagesState);
  const list = useRef<FlashList<RoomChatMessage> | null>(null);
  const {
    message,
    loading,
    autoScrollEnabled,
    unreadedMessagesCount,
    contributionPopupOpened,
    selectedContribution,
    contributionProcessState,
    pinnedContributionMessage,
    makeContribution,
    toggleContributionModal,
    sendMessage,
    scrollToBottom,
    handleOnScroll,
    handleContentSizeChange,
    handleOnLayout,
    handleChangeMessage,
    handleOnLoad,
    sendGif,
  } = useChat(list);

  return (
    <SafeAreaView style={styles.baseSafeArea}>
      <ChatHeader />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={commonStyles.flexFull}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <Flex style={styles.bodyContainer}>
          {loading && chatMessages.length > 0 && (
            <Flex style={styles.loadingContainer} alignItems='center' justifyContent='center'>
              <ChatterIcon name='chatter-primary-logo' size={60} color={colorPalette.primary400} />
            </Flex>
          )}

          <FlashList
            data={chatMessages}
            onLoad={handleOnLoad}
            onScroll={handleOnScroll}
            renderItem={ChatMessage}
            getItemType={(item) => {
              return item.type;
            }}
            estimatedItemSize={720}
            onLayout={handleOnLayout}
            viewabilityConfig={viewabilityConfig}
            ref={list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            onContentSizeChange={handleContentSizeChange}
          />

          {pinnedContributionMessage && (
            <Flex style={pinnedContribution.base}>
              <AnimatedFlex
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                gap={4}
                style={pinnedContribution.contributionStyle}
              >
                <Flex flexDirection='row' justifyContent='space-between' gap={8}>
                  <Flex flexDirection='row' gap={4}>
                    <Avatar size={48} url={pinnedContributionMessage.user.avatar} />
                    <Flex gap={4}>
                      <Typography type='body' size='semibold' color='textLabel'>
                        {`${pinnedContributionMessage.user.first_name} ${pinnedContributionMessage.user.last_name}`}
                      </Typography>
                      <Typography
                        type='label'
                        size='medium'
                        color='textDefault'
                      >{`$${Math.round(pinnedContributionMessage.content.amount)}`}</Typography>
                    </Flex>
                  </Flex>
                  <Typography style={pinnedContribution.contributionChatterLogo}>{t('common.chatter')}</Typography>
                </Flex>
                <Typography numberOfLines={1} type='body' size='default' color='textDefault'>
                  {pinnedContributionMessage.content.text}
                </Typography>
              </AnimatedFlex>
            </Flex>
          )}
        </Flex>
        <Flex style={footerStyles.base}>
          <Flex gap={8} style={popupContainer.base}>
            {!autoScrollEnabled && unreadedMessagesCount > 0 && (
              <AnimatedFlex entering={FadeInDown}>
                <Button
                  style={popupContainer.newMessages}
                  text={`${unreadedMessagesCount} ${t('room.newMessages')}`}
                  type='primary'
                  size='sm'
                  onPress={scrollToBottom}
                />
              </AnimatedFlex>
            )}
            {contributionPopupOpened && <Contribute />}
          </Flex>
          <Flex flexDirection='row' alignItems='flex-end' gap={4}>
            <AnimatedFlex flex={1} style={input.base} alignItems={'center'} flexDirection='row'>
              <TextInput
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                placeholder={`${t('room.message')}...`}
                value={message}
                onChangeText={handleChangeMessage}
                multiline
                placeholderTextColor={colorPalette.grey50}
                containerStyle={footerStyles.inputContainer}
                style={footerStyles.input}
              />
              {!message && (
                <Flex gap={6} flexDirection='row' alignItems='center'>
                  <TouchableOpacity style={footerStyles.gifButton} onPress={sendGif}>
                    <Typography style={footerStyles.gifButtonText} color='black'>
                      GIF
                    </Typography>
                  </TouchableOpacity>
                </Flex>
              )}
            </AnimatedFlex>
            {selectedContribution?.identifier ? (
              <Button
                type='contribute'
                text={`$${Math.round(selectedContribution.price)}`}
                iconName={'send'}
                onPress={makeContribution}
                iconPosition={'right'}
              />
            ) : (
              <Button type='contribute' active={contributionPopupOpened} text={'$'} onPress={toggleContributionModal} />
            )}
            {message.length > 0 && !selectedContribution?.identifier && (
              <IconButton
                style={{ padding: normalize(10) }}
                borderRadius='minimal'
                iconName='send'
                size='lg'
                disabled={!message.trim()}
                type='send'
                onPress={sendMessage}
                sizeOfIcon={18}
              />
            )}
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
      {(contributionProcessState === 'PROCESSING' || contributionProcessState === 'ERROR') && (
        <ContributionProcessModal tryAgain={makeContribution} state={contributionProcessState} />
      )}
    </SafeAreaView>
  );
};

export default memo(Chat);

const pinnedContribution = StyleSheet.create({
  base: {
    top: 0,
    right: normalize(20),
    left: normalize(20),
    paddingVertical: 4,
    position: 'absolute',
  },
  contributionStyle: {
    paddingHorizontal: normalize(12),
    paddingVertical: 6,
    backgroundColor: colorPalette.primary800,
    borderRadius: 20,
    borderWidth: 0.6,
    borderColor: '#E6E0D4',
  },

  contributionChatterLogo: {
    paddingTop: 8,
  },
});

const styles = StyleSheet.create({
  baseSafeArea: {
    flexGrow: 1,
    backgroundColor: colorPalette.grey850,
    paddingBottom: Platform.OS === 'ios' ? normalize(100) : normalize(120),
  },
  scrollContent: {
    paddingHorizontal: normalize(20),
  },

  bodyContainer: {
    flex: 1,
    flexGrow: 1,
  },
  loadingContainer: {
    position: 'absolute',
    overflow: 'hidden',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(24),
    flex: 1,
    zIndex: 2,
    backgroundColor: colorPalette.grey850,
  },
});

const footerStyles = StyleSheet.create({
  base: {
    backgroundColor: colorPalette.grey850,
    paddingHorizontal: normalize(20),
    paddingVertical: 8,
  },
  inputContainer: {
    flex: 1,
    maxHeight: normalize(100),
  },
  input: {
    fontFamily: 'Aeonik-Regular',
    fontSize: normalize(14),
    lineHeight: normalize(16),
    paddingBottom: 0,
    justifyContent: 'center',
    paddingTop: 0,
  },
  gifButton: {
    backgroundColor: colorPalette.grey100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderRadius: 6,
    height: normalize(20),
  },
  gifButtonText: {
    fontSize: normalize(12),
  },
});

const input = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.buttonDefaultNormal,
    paddingHorizontal: normalize(16),
    minHeight: normalize(42),
    maxHeight: normalize(80),
    // paddingVertical: normalize(11),
    borderRadius: 6,
  },
});

const popupContainer = StyleSheet.create({
  base: {
    position: 'absolute',
    bottom: 30,
    paddingBottom: 30,
    alignSelf: 'center',
    width: '100%',
  },

  newMessages: {
    alignSelf: 'center',
  },
});
