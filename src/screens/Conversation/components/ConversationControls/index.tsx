import { Dispatch, FC, SetStateAction, memo, useCallback, useEffect } from 'react';
import { StyleSheet, Vibration } from 'react-native';
import Animated, { FadeInDown, FadeOutDown, LinearTransition } from 'react-native-reanimated';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import { normalize } from '~/utils/normalize';
import { ConversationImage } from '../../screens/NewConversation/types';
import { uploadConversationImage } from '../../utils/uploadConversationImage';
import { permissions } from '../../utils/permissions';
import { useMutation } from '@tanstack/react-query';
import { api } from '~/api';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';
import ControlsHeader from './ControlsHeader';
import { AudioTypes, RecordingStatus } from '~/hooks/useAudioRecorder/types';
import useAudioRecorder from '~/hooks/useAudioRecorder/useAudioRecorder';

interface IConversationControls {
  setStatus: Dispatch<SetStateAction<RecordingStatus>>;
  setIsLinkModalOpen?: Dispatch<SetStateAction<boolean>>;
  setIsTitleModalOpen?: Dispatch<SetStateAction<boolean>>;
  setImageUriValue?: Dispatch<SetStateAction<string | undefined>>;
  setImage?: Dispatch<SetStateAction<ConversationImage | undefined>>;
  setAudio: Dispatch<SetStateAction<AudioTypes | undefined>>;
  setLink?: Dispatch<SetStateAction<string | undefined>>;
  audio?: AudioTypes | undefined;
  status: RecordingStatus;
  isReply?: boolean;
  conversationId?: string;
  link?: string | undefined;
  image?: ConversationImage | undefined;
}

const ConversationControls: FC<IConversationControls> = ({
  setStatus,
  status,
  setIsLinkModalOpen,
  setIsTitleModalOpen,
  setImageUriValue,
  setImage,
  setLink,
  setAudio,
  audio,
  conversationId,
  isReply = false,
  link,
  image,
}) => {
  const { navigate } = useNavigation();

  const { mutate, isSuccess, isError, error, data, isPending } = useMutation({
    mutationFn: (params: { id: string | undefined; formData: FormData }) => {
      const { id, formData } = params;
      return api.conversations.addReplyToConversation(id, formData);
    },
  });

  const openLinkModal = useCallback(() => {
    setIsLinkModalOpen && setIsLinkModalOpen(true);
  }, [setIsLinkModalOpen]);

  const uploadConversation = useCallback(() => {
    if (!isReply && setIsTitleModalOpen) setIsTitleModalOpen(true);
    else {
      const formData = new FormData();
      link && formData.append('link', link);
      audio?.audio && formData.append('audio', audio?.audio);
      image && formData.append('image', image);
      mutate({ id: conversationId, formData: formData });
    }
  }, [audio?.audio, conversationId, image, isReply, link, mutate, setIsTitleModalOpen]);

  useEffect(() => {
    isError &&
      Toast.show({
        type: 'error',
        text1: 'Something is wrong. Try again',
      } as CustomShowParams);
    isPending &&
      Toast.show({
        type: 'normal',
        text1: 'Reply in the process of creation',
      } as CustomShowParams);
    if (isSuccess) {
      Toast.show({
        type: 'normal',
        text1: 'Reply is created',
      } as CustomShowParams);
      navigate('Main', { screen: 'Home' });
    }
  }, [data, error, isError, isPending, isSuccess, navigate]);
  const uploadImage = useCallback(() => {
    setImageUriValue && setImage && uploadConversationImage(setImageUriValue, setImage);
  }, [setImage, setImageUriValue]);

  const {
    onStartRecord,
    onStopRecord,
    onStartPlay,
    onPausePlay,
    onResumePlay,
    recordState,
    setRecordState,
    audioRecorderPlayer,
  } = useAudioRecorder(setStatus, setAudio);

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopPlayer();
    };
  }, [audioRecorderPlayer]);

  const removeConversation = useCallback(() => {
    setImageUriValue && setImageUriValue(undefined);
    setStatus('unrecorded');
    setAudio(undefined);
    setImage && setImage(undefined);
    setLink && setLink(undefined);
    audioRecorderPlayer.stopPlayer();
    setRecordState({
      recordSecs: 0,
      recordTime: '',
      playTime: '',
    });
  }, [audioRecorderPlayer, setAudio, setImage, setImageUriValue, setLink, setRecordState, setStatus]);

  const recordAudio = useCallback(() => {
    permissions().then((res) => {
      if (res === 'granted') {
        setStatus('recording');
        Vibration.vibrate(30);
        onStartRecord();
      } else {
        return;
      }
    });
  }, [onStartRecord, setStatus]);

  const stopRecording = useCallback(() => {
    if (status === 'recording') {
      onStopRecord();
    }
  }, [onStopRecord, status]);

  return (
    <Flex>
      <ControlsHeader recordState={recordState} status={status} isReply={isReply} />

      {status !== 'recording' && status !== 'unrecorded' ? (
        <Animated.View
          layout={LinearTransition.duration(300)}
          entering={FadeInDown}
          exiting={FadeOutDown}
          style={bottomControls.container}
        >
          <IconButton iconName='trash-outline' type='delete-control' size='3xl' onPress={removeConversation} />
          <IconButton iconName='image-outline' type='secondary' size='3xl' onPress={uploadImage} />
          {status !== 'playing' && (
            <IconButton
              iconName='play'
              type='secondary'
              size='3xl'
              onPress={status === 'paused' ? onResumePlay : () => onStartPlay()}
            />
          )}
          {status === 'playing' && <IconButton iconName='pause' type='primary' size='3xl' onPress={onPausePlay} />}
          <IconButton iconName='send' type='primary' size='3xl' onPress={uploadConversation} />
          <IconButton iconName='link-outline' type='secondary' size='3xl' onPress={openLinkModal} />
        </Animated.View>
      ) : (
        <AnimatedFlex
          layout={LinearTransition.duration(300)}
          entering={FadeInDown}
          exiting={FadeOutDown}
          justifyContent='center'
          flexDirection='row'
          alignItems='center'
          gap={2}
          style={bottomControls.container}
        >
          <IconButton iconName='image-outline' type='secondary' size='3xl' disabled />
          <IconButton
            iconName='mic'
            type='conversation-record'
            delayLongPress={200}
            onLongPress={recordAudio}
            onPressOut={stopRecording}
            size='3xl'
          />
          <IconButton iconName='link-outline' disabled type='secondary' size='3xl' />
        </AnimatedFlex>
      )}
    </Flex>
  );
};
const bottomControls = StyleSheet.create({
  header: {
    paddingBottom: normalize(10),
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

export default memo(ConversationControls);
