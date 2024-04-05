import { type FC, memo, useMemo, useRef, useCallback, useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { type LocalParticipant } from 'livekit-client';

import IconButton from '~/ui/IconButton';
import { useMicControl } from '../../hooks/useMicControl';
import { useRecoilValue } from 'recoil';
import { state } from '../../state/roomState';
import { useStorageUser } from '~/services/mmkv/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFirstRender } from '~/hooks/useIsFirstRender';

type MicButtonProps = {
  style?: StyleProp<ViewStyle>;
  localParticipant: LocalParticipant;
};

const MicButton: FC<MicButtonProps> = ({ localParticipant }) => {
  const { micEnabled, toggleMic } = useMicControl(localParticipant);
  const roomDetails = useRecoilValue(state.roomDetailsState);
  const [user] = useStorageUser();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const firstRender = useIsFirstRender();

  useFocusEffect(
    useCallback(() => {
      if (roomDetails?.host_id && user?.id && firstRender) {
        localParticipant.setMicrophoneEnabled(true);
        timerRef.current = setTimeout(() => {
          localParticipant.setMicrophoneEnabled(false);
        }, 600);
      }

      return () => {
        timerRef.current && clearTimeout(timerRef.current);
      };
    }, []),
  );

  const micIcon = useMemo(() => {
    return micEnabled ? 'mic' : 'mic-off-outline';
  }, [micEnabled]);

  return <IconButton type='room-control' active on={micEnabled} iconName={micIcon} onPress={toggleMic} size='3xl' />;
};

export default memo(MicButton);
