import { memo, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { useStorageUser } from '~/services/mmkv/auth';
import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import ConversationHeader from '../../components/ConversationHeader';
import ConversationControls from '../../components/ConversationControls';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ConversationModal from '../../components/ConversationModal';
import { useTranslation } from 'react-i18next';
import { ConversationImage } from './types';
import FastImage from 'react-native-fast-image';
import { normalize } from '~/utils/normalize';
import { useMutation } from '@tanstack/react-query';
import { api } from '~/api';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomShowParams } from '~/ui/Toast/types';
import Toast from 'react-native-toast-message';
import { AudioTypes, RecordingStatus } from '~/hooks/useAudioRecorder/types';

const NewConversation = () => {
  const [user] = useStorageUser();
  const [status, setStatus] = useState<RecordingStatus>('unrecorded');
  const [image, setImage] = useState<ConversationImage>();
  const [link, setLink] = useState<string>();
  const { t } = useTranslation();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [imageUriValue, setImageUriValue] = useState<string>();
  const [audio, setAudio] = useState<AudioTypes>();
  const [title, setTitle] = useState<string>();
  const { navigate } = useNavigation();
  const borderWidth = useSharedValue(0.5);

  const { mutate, isSuccess, isError, error, data, isPending } = useMutation({
    mutationFn: (formData: FormData) => api.conversations.createNewConversation(formData),
  });

  const handleSetTitle = useCallback((title: string) => {
    setTitle(title);
  }, []);

  useEffect(() => {
    if (title) {
      const post = async () => {
        const formData = new FormData();
        title && formData.append('title', title);
        link && formData.append('link', link);
        formData.append('audio', audio?.audio);
        image?.name && audio?.audio && formData.append('image', image);
        mutate(formData);
      };

      post();
    }
  }, [audio, image, mutate, title, link]);

  useEffect(() => {
    isError &&
      Toast.show({
        type: 'error',
        text1: 'Something is wrong. Try again',
      } as CustomShowParams);
    isPending &&
      Toast.show({
        type: 'normal',
        text1: 'Conversation in the process of creation',
      } as CustomShowParams);
    if (isSuccess) {
      Toast.show({
        type: 'normal',
        text1: 'Conversation is created',
      } as CustomShowParams);
      navigate('Main', { screen: 'Home' });
    }
  }, [data, error, isError, isPending, isSuccess, navigate]);

  useEffect(() => {
    if (status !== 'unrecorded') {
      borderWidth.value = withTiming(2, {
        duration: 300,
        easing: Easing.in(Easing.linear),
      });
    } else {
      borderWidth.value = withTiming(0.5, { duration: 300, easing: Easing.in(Easing.linear) });
    }
  }, [borderWidth, status]);

  const deleteImage = useCallback(() => {
    setImageUriValue(undefined);
    setImage(undefined);
  }, []);

  const avatarBorderWidth = useAnimatedStyle(() => {
    return { borderWidth: borderWidth.value };
  });

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex flex={1} style={commonStyles.baseScreenPadding}>
        <ConversationHeader type='owner' />
        <Flex flex={1} gap={95} style={styles.conversationContainer} alignItems='center'>
          <Animated.View style={[styles.mainAvatar, avatarBorderWidth]}>
            <Avatar url={user?.avatar} size={120} />
          </Animated.View>
        </Flex>
        {imageUriValue && (
          <Animated.View
            style={styles.imageContainer}
            layout={LinearTransition.duration(400)}
            exiting={FadeOut}
            entering={FadeIn}
          >
            <TouchableOpacity style={styles.imageCloseButton} onPress={deleteImage}>
              <Icon name='trash-outline' color={colorPalette.white} size={16} />
            </TouchableOpacity>
            <FastImage source={{ uri: imageUriValue }} style={styles.imageStyle} />
          </Animated.View>
        )}

        <ConversationControls
          setAudio={setAudio}
          setIsTitleModalOpen={setIsTitleModalOpen}
          setImage={setImage}
          setIsLinkModalOpen={setIsLinkModalOpen}
          status={status}
          setStatus={setStatus}
          setImageUriValue={setImageUriValue}
        />
      </Flex>
      {isLinkModalOpen && (
        <ConversationModal
          title={t('conversation.pasteLink')}
          placeholder={t('conversation.enterLink')}
          successButtonText={t('common.add')}
          isModalOpen={isLinkModalOpen}
          setLink={setLink}
          setIsModalOpen={setIsLinkModalOpen}
        />
      )}
      {isTitleModalOpen && (
        <ConversationModal
          handleSetTitle={handleSetTitle}
          title={t('conversation.conversationTitle')}
          placeholder={t('common.example')}
          successButtonText={t('common.finish')}
          isModalOpen={isTitleModalOpen}
          setIsModalOpen={setIsTitleModalOpen}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainAvatar: { borderRadius: 360, padding: 8, borderColor: colorPalette.primary400 },
  conversationContainer: { paddingTop: normalize(180) },
  imageContainer: { alignSelf: 'center', paddingBottom: normalize(15) },
  imageCloseButton: {
    position: 'absolute',
    right: 2,
    top: 2,
    zIndex: 20,
    padding: 8,
    backgroundColor: 'rgba(56.82, 55.07, 51.79, 0.50)',
    borderRadius: 44,
  },
  imageStyle: { width: normalize(88), height: normalize(88), borderRadius: 9.5 },
});

export default memo(NewConversation);
