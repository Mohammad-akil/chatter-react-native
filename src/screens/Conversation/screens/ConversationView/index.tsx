import { FC, memo, useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { commonStyles } from '~/styles';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import ConversationHeader from '../../components/ConversationHeader';
import { normalize } from '~/utils/normalize';
import { api } from '~/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConversationViewControls from '../../components/ConversationViewControls';
import { useNavigation } from '@react-navigation/native';
import { ConversationContent, ConversationViewTypes } from '~/entities/Conversations';
import { useStorageUser } from '~/services/mmkv/auth';
import { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import ConversationControls from '../../components/ConversationControls';
import { ConversationImage } from '../NewConversation/types';
import SkeletonComponent from '../../components/SkeletonComponent';
import { ContentTypes } from './types';
import AudioCaptionPlayer from '~/components/AudioCaptionPlayer';
import { generateRandomId } from '~/utils';
import { setActivePartOfConversation } from '../../utils/setActivePartConversation';
import ConversationModal from '../../components/ConversationModal';
import { useTranslation } from 'react-i18next';
import RepliesList from '../../components/RepliesList';
import MediaComponent from '../../components/MediaComponent';
import { AudioTypes, RecordingStatus } from '~/hooks/useAudioRecorder/types';

interface ConversationViewProps {
  conversationId: string;
  currentIndex: number | undefined;
  indexOfElement: number;
  playNextConversation: () => void;
}

const ConversationView: FC<ConversationViewProps> = ({
  conversationId,
  currentIndex,
  indexOfElement,
  playNextConversation,
}) => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const [user] = useStorageUser();
  const [conversationData, setConversationData] = useState<ConversationViewTypes>();
  const [activePart, setActivePart] = useState<ConversationContent>();
  const [status, setStatus] = useState<RecordingStatus>('unrecorded');
  const [audio, setAudio] = useState<AudioTypes>();
  const [image, setImage] = useState<ConversationImage>();
  const [link, setLink] = useState<string>();
  const [imageUriValue, setImageUriValue] = useState<string>();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [type, setType] = useState<'viewer' | 'reply'>('viewer');
  const [content, setContent] = useState<ContentTypes>();
  const [currentAudio, setCurrentAudio] = useState<number>(0);
  const [playedContentIds, setPlayedContentIds] = useState<string[]>([]);
  const [likesCounter, setLikesCounter] = useState<number>(0);
  const queryClient = useQueryClient();

  const { data, mutate, isSuccess } = useMutation({
    mutationFn: (conversationId: string) => api.conversations.getConversationById(conversationId),
    mutationKey: [conversationId],
  });

  useEffect(() => {
    if (isSuccess) {
      setConversationData(data);
      setLikesCounter(+data.likes);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (indexOfElement === currentIndex) {
      mutate(conversationId);
      setType('viewer');
      setCurrentAudio(0);
    } else {
      setConversationData(undefined);
    }
  }, [conversationId, currentIndex, indexOfElement, mutate, queryClient]);

  const selectPart = useCallback(
    (index: number) => {
      conversationData &&
        setActivePartOfConversation(index, setCurrentAudio, setActivePart, setContent, conversationData);
    },
    [conversationData],
  );

  useEffect(() => {
    if (isSuccess && conversationData) {
      setActivePartOfConversation(0, setCurrentAudio, setActivePart, setContent, conversationData);
    }
  }, [conversationData, isSuccess]);

  const audioDone = useCallback(
    (id: string) => {
      if (conversationData && conversationData.content[currentAudio + 1]) {
        const nextContentIndex = currentAudio + 1;
        setActivePartOfConversation(nextContentIndex, setCurrentAudio, setActivePart, setContent, conversationData);
        if (!playedContentIds.includes(id)) {
          setPlayedContentIds((prev) => [...prev, id]);
          return;
        } else {
          return;
        }
      } else if (conversationData && user) {
        setType('reply');
        setCurrentAudio(-1);
        setActivePart(undefined);
        conversationData?.content.push({
          content: {
            audio_message: '',
            image: null,
            link: null,
          },
          duration: '01',
          id: generateRandomId().toString(),
          caption_url: '',
          user: {
            avatar: user.avatar,
            first_name: user.first_name,
            id: user.id,
            last_name: user.last_name,
            username: user.username,
          },
        });
      }
    },
    [conversationData, currentAudio, user, playedContentIds],
  );

  useEffect(() => {
    if (type === 'reply' && !audio?.audio) {
      const timeoutId = setTimeout(() => {
        if (conversationData?.nextConversationId) playNextConversation();
        else navigate('Drawer');
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, type]);

  const deleteImage = useCallback(() => {
    setImageUriValue(undefined);
    setImage(undefined);
  }, []);
  if (isSuccess && conversationData) {
    const listMargin = { marginTop: normalize(40) };
    return (
      <SafeAreaView style={commonStyles.baseSafeArea}>
        <AnimatedFlex entering={FadeIn} exiting={FadeOut} layout={LinearTransition.duration(300)} flex={1} gap={10}>
          <ConversationHeader
            activeTab={currentAudio}
            conversationData={conversationData}
            activePart={activePart}
            type={type}
            audio={audio}
            likesCounter={likesCounter}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Flex flex={1} gap={60} justifyContent='space-between'>
              <AnimatedFlex
                entering={FadeIn}
                exiting={FadeOut}
                layout={LinearTransition.duration(300)}
                justifyContent='center'
                alignItems='center'
                style={listMargin}
                gap={16}
              >
                <RepliesList
                  conversationData={conversationData}
                  currentAudio={currentAudio}
                  type={type}
                  selectPart={selectPart}
                />
              </AnimatedFlex>
            </Flex>
          </ScrollView>
          <MediaComponent
            type={type}
            activePart={activePart}
            conversationData={conversationData}
            currentAudio={currentAudio}
            imageUriValue={imageUriValue}
            deleteImage={deleteImage}
          />
          {content && type !== 'reply' && <AudioCaptionPlayer content={content} onDone={audioDone} />}
          {type === 'reply' ? (
            <ConversationControls
              conversationId={conversationData.id}
              setImage={setImage}
              isReply
              audio={audio}
              setStatus={setStatus}
              setAudio={setAudio}
              setLink={setLink}
              status={status}
              setImageUriValue={setImageUriValue}
              setIsLinkModalOpen={setIsLinkModalOpen}
              image={image}
              link={link}
            />
          ) : (
            <ConversationViewControls
              activeTab={currentAudio}
              liked={conversationData.like}
              conversationId={conversationData.id}
              conversationContent={conversationData.content}
              selectPart={selectPart}
              setLikesCounter={setLikesCounter}
            />
          )}
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
        </AnimatedFlex>
      </SafeAreaView>
    );
  }

  return <SkeletonComponent />;
};

export default memo(ConversationView);
