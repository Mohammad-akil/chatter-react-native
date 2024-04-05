import { Dispatch, SetStateAction } from 'react';
import { ConversationType } from '~/entities/DirectMessages';

export interface ConversationsListProps {
  conversationsList: ConversationType[];
  setConversationsList: Dispatch<SetStateAction<ConversationType[]>>;
  swipeAnimations: any;
}
export interface EmptyConversationProps {
  goToNewMessage: () => void;
}
