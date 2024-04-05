import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases';
import { useRecoilState, useRecoilValue } from 'recoil';

import { api } from '~/api';
import { CreateContributionPayload } from '~/api/services/room/types';
import { RoomChatMessage } from '~/entities/Message';
import { client } from '~/services/websocket';

import useGifMessage from './useGifMessage';
import {
  contributionPopupOpenedState,
  contributionProcessState as _contributionProcessState,
  selectedContributionState,
  pinnedContributionMessageState,
} from '../state/chatState';
import { state } from '../state/roomState';

const LOADING_TIME = 700;

export const useChat = (listRef: MutableRefObject<FlashList<RoomChatMessage> | null>) => {
  const roomDetails = useRecoilValue(state.roomDetailsState);

  const { handlePickGif } = useGifMessage();

  const [pinnedContributionMessage] = useRecoilState(pinnedContributionMessageState);

  const [selectedContribution, setSelectedContribution] = useRecoilState(selectedContributionState);
  const [contributionPopupOpened, setContributionPopupOpened] = useRecoilState(contributionPopupOpenedState);

  const [contributionProcessState, setContributionProcessState] = useRecoilState(_contributionProcessState);

  const [loading, setLoading] = useState(true);
  const [initialRender, setInitialRender] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [unreadedMessagesCount, setUnreadMessagesCount] = useState(0);

  const [message, setMessage] = useState('');

  const sendMessage = useCallback(() => {
    if (message) {
      client.publish(`room/${roomDetails!.id}/chat/send`, {
        type: 'text',
        content: message.trim(),
      });
      setMessage('');
    }
  }, [roomDetails, message]);

  const sendGif = useCallback(() => {
    handlePickGif();
  }, [handlePickGif]);

  const makeContribution = useCallback(async () => {
    if (selectedContribution && roomDetails?.id) {
      try {
        setContributionProcessState('PROCESSING');
        const purchaseResponse = await Purchases.purchaseStoreProduct(selectedContribution);
        const dataToPass: CreateContributionPayload = {
          tx_id: purchaseResponse.transaction.transactionIdentifier,
          room_id: roomDetails.id,
          amount: selectedContribution.price,
          platform: Platform.OS,
          msg_content: message.trim(),
        };

        await api.room.createContribution(dataToPass);
        setContributionPopupOpened(false);
        setSelectedContribution(null);
        setMessage('');
        setContributionProcessState('SUCCESS');
      } catch (error: any) {
        if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
          setContributionProcessState(null);
          return;
        }
        setContributionProcessState('ERROR');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContribution, message, roomDetails?.id]);

  const toggleContributionModal = useCallback(() => {
    setContributionPopupOpened((prev) => !prev);
  }, [setContributionPopupOpened]);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [listRef]);

  const handleOnScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const maxOffset = contentSize.height - layoutMeasurement.height;

    const normalizedContentOffsetY = Math.round(contentOffset.y);
    const normalizedMaxOffset = Math.round(maxOffset);

    if (normalizedContentOffsetY >= normalizedMaxOffset) {
      setAutoScrollEnabled(true);
    } else {
      setAutoScrollEnabled(false);
    }
  }, []);

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      if (initialRender) return;
      if (autoScrollEnabled) {
        listRef.current?.state.data?.length &&
          listRef.current.state.data.length > 0 &&
          listRef.current?.scrollToOffset({ offset: height, animated: true });
      }
    },
    [initialRender, autoScrollEnabled, listRef],
  );

  const handleOnLayout = useCallback(() => {
    if (initialRender) return;

    if (listRef.current?.state.data?.length && listRef.current.state.data.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
      setAutoScrollEnabled(true);
    }
  }, [listRef, initialRender]);

  const handleChangeMessage = useCallback((text: string) => {
    setMessage(text);
  }, []);

  const handleOnLoad = useCallback(() => {
    setInitialRender(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!initialRender) {
        timeoutRef.current = setTimeout(() => {
          listRef.current?.state.data?.length &&
            listRef.current.state.data.length > 0 &&
            listRef.current?.scrollToEnd({ animated: false });
          setLoading(false);
        }, LOADING_TIME);
      }

      return () => {
        timeoutRef.current && clearTimeout(timeoutRef.current);
        setLoading(true);
      };
    }, [initialRender, listRef]),
  );

  useFocusEffect(
    useCallback(() => {
      const handleMessages = () => {
        if (autoScrollEnabled) {
          return;
        }

        if (!autoScrollEnabled) {
          setUnreadMessagesCount((prev) => prev + 1);
        }
      };

      client.on('message', handleMessages);
      return () => {
        client.off('message', handleMessages);
      };
    }, [autoScrollEnabled]),
  );

  useEffect(() => {
    if (autoScrollEnabled) {
      setUnreadMessagesCount(0);
    }
  }, [autoScrollEnabled]);

  return {
    loading,
    autoScrollEnabled,
    unreadedMessagesCount,
    pinnedContributionMessage,
    message,
    sendMessage,
    sendGif,
    scrollToBottom,
    handleOnScroll,
    handleContentSizeChange,
    handleChangeMessage,
    handleOnLayout,
    handleOnLoad,
    makeContribution,
    selectedContribution,
    contributionPopupOpened,
    contributionProcessState,
    toggleContributionModal,
  };
};
