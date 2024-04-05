import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';

import { MessageFromSomeUser } from '../DMThreadMessages/MessageFromSomeUser';
import { DMThreadFooter } from '../DMThreadFooter';

import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';
import { MyMessage } from '../DMThreadMessages/MyMessage';
import { api } from '~/api';
import { useStorageUser } from '~/services/mmkv/auth';
import { Message } from '~/entities/DirectMessages';
import { colorPalette } from '~/styles/colors';
import { client } from '~/services/websocket';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';
import MessageModal from '../MessageModal';

const DMThreadBody = ({ chatId }: { chatId: string }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user] = useStorageUser();
  const messagesListRef = useRef<FlatList>(null);
  const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
  const { width } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message>();

  useEffect(() => {
    const getMessagesHistory = async () => {
      const res = await api.directMessages.getConversationMessagesHistory(chatId);
      if (!res.success) {
        Toast.show({
          type: 'error',
          text1: res.error,
        } as CustomShowParams);
        return;
      }
      setMessages(res.data);
    };
    getMessagesHistory();
  }, [chatId, setMessages]);

  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, [setMessages]);

  useEffect(() => {
    client.on('direct-message', (message: Message) => {
      setMessages((prevMessages: Message[]) => [...prevMessages, message.content.data.message]);
    });
  }, [setMessages]);

  const scrollToBottom = useCallback(() => {
    if (messagesListRef.current) {
      const offset = normalize(30);
      const yPosition = contentHeight + offset;

      messagesListRef.current.scrollToOffset({ offset: yPosition, animated: true });
    }
  }, [contentHeight]);

  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      setContentHeight(height);
      scrollToBottom();
    },
    [scrollToBottom],
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const renderItem: ListRenderItem<Message> = useCallback(
    ({ item, index }) => {
      const imageGeneralStyles = { maxWidth: width - normalize(90) };
      const imageMessageStyle =
        item.type === 'image' || item.type === 'gif' || item.type === 'imageText'
          ? { borderRadius: 10, backgroundColor: colorPalette.blue450 }
          : {
              paddingVertical: 6,
              paddingHorizontal: normalize(10),
              borderRadius: 10,
              backgroundColor: colorPalette.blue450,
            };
      const gifStyle =
        item.type === 'gif'
          ? { aspectRatio: item.content.aspect_ratio, width: '100%', height: 'auto', borderRadius: 10 }
          : {};
      const prevMessage = messages[index - 1];
      const paddingAnotherUser = prevMessage?.sender?.id !== item.sender?.id ? { paddingTop: normalize(36) } : null;

      const renderedContent = () => {
        if (item.sender?.id !== user?.id) {
          return (
            <TouchableOpacity
              onLongPress={() => {
                setSelectedMessage(item);
                setIsModalOpen(true);
              }}
            >
              <MessageFromSomeUser
                item={item}
                gifStyle={gifStyle}
                prevMessage={prevMessage}
                paddingAnotherUser={paddingAnotherUser}
                imageMessageStyle={imageMessageStyle}
                imageGeneralStyles={imageGeneralStyles}
              />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              onLongPress={() => {
                setSelectedMessage(item);
                setIsModalOpen(true);
              }}
            >
              <MyMessage
                item={item}
                gifStyle={gifStyle}
                prevMessage={prevMessage}
                paddingAnotherUser={paddingAnotherUser}
                imageMessageStyle={imageMessageStyle}
                imageGeneralStyles={imageGeneralStyles}
              />
            </TouchableOpacity>
          );
        }
      };

      return renderedContent();
    },
    [messages, user?.id, width],
  );

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={keyboardBehavior}>
      <Flex flex={1}>
        {messages?.length ? (
          <FlatList
            ref={messagesListRef}
            showsVerticalScrollIndicator={false}
            data={messages}
            contentContainerStyle={styles.chatBodyContainer}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            onContentSizeChange={onContentSizeChange}
          />
        ) : (
          <Flex flex={1} justifyContent='center' alignItems='center'>
            <Typography type='headline' size='default' textAlign='center'>
              {t('chat.beginning')}
            </Typography>
          </Flex>
        )}
      </Flex>
      <DMThreadFooter chatId={chatId} />
      {isModalOpen && (
        <MessageModal
          setMessages={setMessages}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          message={selectedMessage}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboard: { flex: 1, ...commonStyles.baseScreenPadding },
  chatBodyContainer: { paddingBottom: normalize(30) },
});

export default memo(DMThreadBody);
