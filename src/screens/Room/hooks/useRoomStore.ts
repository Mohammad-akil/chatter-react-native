import { useCallback } from 'react';
import { useResetRecoilState } from 'recoil';

import { state } from '../state/roomState';
import {
  chatMessagesState,
  chatOpenedState,
  contributionPopupOpenedState,
  contributionProcessModalOpenedState,
  selectedContributionState,
} from '../state/chatState';

export const useRoomStore = () => {
  const clearRoomState = useResetRecoilState(state.roomState);
  const clearRoomDetailsState = useResetRecoilState(state.roomDetailsState);
  const clearCurrentRoomProviderState = useResetRecoilState(state.currentRoomProviderState);
  const clearCurrentRoleState = useResetRecoilState(state.currentRoleState);
  const clearActiveSpeakersState = useResetRecoilState(state.activeSpeakersState);
  const clearMusicModeState = useResetRecoilState(state.musicModeState);
  const clearHandRaisedState = useResetRecoilState(state.handRaisedState);
  const clearRoomControlsState = useResetRecoilState(state.roomControlsOpenedState);
  const clearStageControlPopupOpenedState = useResetRecoilState(state.stageControlPopupOpenedState);
  const clearParticipantInfoPopupState = useResetRecoilState(state.participantInfoPopupState);
  const clearEndRoomModalState = useResetRecoilState(state.endRoomModalOpenedState);
  const clearSelectedVideoTypeState = useResetRecoilState(state.selectedVideoTypeState);
  const clearLocalTrackPublicationState = useResetRecoilState(state.localTrackPublicationState);
  const clearLivekitStreamingParticipantState = useResetRecoilState(state.livekitStreamingParticipantState);
  const clearSocketStreamingParticipantState = useResetRecoilState(state.socketStreamingParticipantState);

  const clearActivePollIdState = useResetRecoilState(state.activePollIdState);
  const clearCreatePollState = useResetRecoilState(state.cretePollState);
  const clearCreatePollPopupOpenedState = useResetRecoilState(state.createPollPopupOpenedState);
  const clearSelectedPollAnswerState = useResetRecoilState(state.selectedPollAnswerState);
  const clearPollTimeState = useResetRecoilState(state.pollTimeState);

  const clearChatMessagesState = useResetRecoilState(chatMessagesState);
  const clearChatOpenedState = useResetRecoilState(chatOpenedState);
  const clearSelectedContributionState = useResetRecoilState(selectedContributionState);
  const clearContributionPopupOpenedState = useResetRecoilState(contributionPopupOpenedState);
  const clearContributionProcessModalOpenedState = useResetRecoilState(contributionProcessModalOpenedState);

  const clearStore = useCallback(() => {
    clearRoomState();
    clearRoomDetailsState;
    clearCurrentRoomProviderState();
    clearCurrentRoleState();
    clearActiveSpeakersState();
    clearMusicModeState();
    clearHandRaisedState();
    clearRoomControlsState();
    clearStageControlPopupOpenedState();
    clearParticipantInfoPopupState();
    clearEndRoomModalState();
    clearSelectedVideoTypeState();
    clearLocalTrackPublicationState();
    clearLivekitStreamingParticipantState();
    clearSocketStreamingParticipantState();

    //POLL STATE
    clearActivePollIdState();
    clearCreatePollState();
    clearCreatePollPopupOpenedState();
    clearSelectedPollAnswerState();
    clearPollTimeState();

    //CHAT STATE
    clearChatMessagesState();
    clearChatOpenedState();
    clearSelectedContributionState();
    clearContributionPopupOpenedState();
    clearContributionProcessModalOpenedState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    clearStore,
    clearCreatePollState,
    clearSelectedPollAnswerState,
    clearPollTimeState,
  };
};
