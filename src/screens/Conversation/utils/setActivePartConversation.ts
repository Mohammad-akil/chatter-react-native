import { Dispatch, SetStateAction } from 'react';
import { ConversationContent, ConversationViewTypes } from '~/entities/Conversations';
import { ContentTypes } from '../screens/ConversationView/types';

export const setActivePartOfConversation = (
  index: number,
  setCurrentAudio: Dispatch<SetStateAction<number>>,
  setActivePart: Dispatch<SetStateAction<ConversationContent | undefined>>,
  setContent: Dispatch<SetStateAction<ContentTypes | undefined>>,
  conversationData: ConversationViewTypes,
) => {
  const currentItem = conversationData.content[index];
  setCurrentAudio(index);
  setActivePart({
    content: {
      audio_message: currentItem.content.audio_message,
      link: {
        description: currentItem.content.link?.description,
        image: currentItem.content.link?.image,
        link: currentItem.content.link?.link,
        title: currentItem.content.link?.title,
      },
      image: currentItem.content.image,
    },
    duration: currentItem.duration,
    id: currentItem.id,
    user: currentItem.user,
    caption_url: currentItem.caption_url,
  });
  setContent({
    id: currentItem.id,
    media: currentItem.content.audio_message,
    captions: currentItem.caption_url,
    user: {
      name: currentItem.user.first_name,
      avatar: currentItem.user.avatar,
    },
  });
};
