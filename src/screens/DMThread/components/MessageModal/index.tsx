import { useMutation } from '@tanstack/react-query';
import { Dispatch, FC, SetStateAction, memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { FadeInDown, FadeOutDown, LinearTransition } from 'react-native-reanimated';
import { api } from '~/api';
import { Message } from '~/entities/DirectMessages';
import { colorPalette } from '~/styles/colors';
import BottomSheet from '~/ui/BottomSheet';
import Button from '~/ui/Button';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
interface IMessageModal {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isModalOpen: boolean;
  message: Message | undefined;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}
const MessageModal: FC<IMessageModal> = ({ setIsModalOpen, isModalOpen, message, setMessages }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const modalWidth = { width: width - normalize(36) };

  const { mutate, data, isSuccess } = useMutation({
    mutationFn: (id: string | undefined) => api.directMessages.deleteDirectMessage(id),
  });

  const deleteMessage = useCallback(() => {
    mutate(message?.id);
  }, [message?.id, mutate]);

  useEffect(() => {
    if (isSuccess) {
      setMessages(data?.data);
      setIsModalOpen(false);
    }
  }, [data, isSuccess, setIsModalOpen, setMessages]);

  return (
    <BottomSheet backgroundStyle={styles.popup} backdropOpacity={0.5} open={isModalOpen} setOpened={setIsModalOpen}>
      <AnimatedFlex
        layout={LinearTransition.duration(300)}
        entering={FadeInDown}
        exiting={FadeOutDown}
        style={[modalWidth, styles.generalContainer]}
      >
        {message?.type === 'text' ? (
          <Flex flex={1}>
            <Flex gap={4}>
              <Typography type='body' size='semibold'>
                {message?.sender.first_name} {message?.sender.last_name}
              </Typography>

              <Typography numberOfLines={3} type='body' size='default'>
                {message?.content}
              </Typography>
            </Flex>
            <Flex gap={6} flexDirection='row' flex={1} style={styles.buttonsContainer} justifyContent='space-between'>
              <Button text={t('common.deleteMessage')} type='cancel' onPress={deleteMessage} />
              <Button
                text={t('common.reply')}
                iconPosition='left'
                type='secondary'
                iconName='arrow-undo'
                style={styles.replyButton}
              />
            </Flex>
          </Flex>
        ) : (
          <Button text={t('common.deleteMessage')} type='cancel' onPress={deleteMessage} />
        )}
      </AnimatedFlex>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: normalize(44),
  },
  popup: { backgroundColor: 'transparent' },
  generalContainer: {
    alignSelf: 'center',
    backgroundColor: colorPalette.grey750,
    marginBottom: 4,
    position: 'absolute',
    bottom: normalize(50),
    padding: normalize(16),
    borderRadius: 6,
  },
  removeButton: {
    borderWidth: 0,
  },
  buttonsContainer: { paddingTop: normalize(16) },
  reportButton: { borderColor: colorPalette.grey700, backgroundColor: colorPalette.grey700, flex: 1 },
  replyButton: { flex: 1 },
});

export default memo(MessageModal);
