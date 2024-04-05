import { PurchasesStoreProduct } from 'react-native-purchases';
import { atom } from 'recoil';
import { ContributionMessage, RoomChatMessage } from '~/entities/Message';

export const chatMessagesState = atom<RoomChatMessage[]>({
  key: 'chat_messages_state',
  default: [],
});

export const chatOpenedState = atom<boolean>({
  key: 'chat_opened_state',
  default: false,
});

export const selectedContributionState = atom<PurchasesStoreProduct | null>({
  key: 'selected_contribution_state',
  default: null,
});

export const contributionPopupOpenedState = atom({
  key: 'contribution_popup_opened_state',
  default: false,
});

export const contributionProcessModalOpenedState = atom({
  key: 'contribution_process_modal_opened_state',
  default: false,
});

export const contributionProcessState = atom<'PROCESSING' | 'ERROR' | 'SUCCESS' | null>({
  key: 'contribution_process_state',
  default: null,
});

export const pinnedContributionMessageState = atom<ContributionMessage | null>({
  key: 'pinned_contribution_message_state',
  default: null,
});
