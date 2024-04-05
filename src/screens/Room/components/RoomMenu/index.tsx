import { memo, useCallback, useState } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Popover from 'react-native-popover-view';
import { useTranslation } from 'react-i18next';

import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';

import { useMicControl } from '../../hooks/useMicControl';

import { normalize } from '~/utils/normalize';
import { colorPalette, colors } from '~/styles/colors';
import { commonPopover } from '~/styles';
import { useNavigation } from '@react-navigation/native';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';

const popoverAnimation = { duration: 300 };

const RoomMenu = () => {
  const room = useRecoilValue(state.roomState);
  const currentRole = useRecoilValue(state.currentRoleState);
  const [musicMode, setMusicMode] = useRecoilState(state.musicModeState);
  const setEndRoomModalOpened = useSetRecoilState(state.endRoomModalOpenedState);
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);

  const { micEnabled, toggleMic } = useMicControl(room.livekitRoom.localParticipant);

  const { t } = useTranslation();
  const [menuOpened, setMenuOpened] = useState(false);
  const { navigate } = useNavigation();

  const popoverStyle = [commonPopover.base, commonPopover.noBackground, { transform: [{ translateX: -80 }] }];

  const toggleMenu = useCallback(() => {
    setMenuOpened((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpened(false);
  }, []);

  const handleEndRoom = useCallback(() => {
    setEndRoomModalOpened(true);
    setMenuOpened(false);
  }, [setEndRoomModalOpened]);

  const handleMusicMode = useCallback(() => {
    setMusicMode((prev) => !prev);
    micEnabled && toggleMic();
  }, [setMusicMode, toggleMic, micEnabled]);

  const goToRoomSettings = useCallback(() => {
    navigate('RoomSettings');
    setMenuOpened(false);
    setRoomControlsOpened(false);
  }, [navigate, setRoomControlsOpened]);

  return (
    <Popover
      key='roomMenu'
      isVisible={menuOpened}
      onRequestClose={closeMenu}
      arrowSize={commonPopover.arrow}
      popoverStyle={popoverStyle}
      animationConfig={popoverAnimation}
      backgroundStyle={commonPopover.noBackground}
      offset={4}
      from={
        <IconButton type='text' active={menuOpened} size='xl' iconName='ellipsis-horizontal' onPress={toggleMenu} />
      }
    >
      <Flex style={dropdown.base}>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={goToRoomSettings}
          style={dropdown.item}
        >
          <Typography numberOfLines={1}>{t('room.roomSettings')}</Typography>
        </TouchableHighlight>
        {currentRole !== 'listener' && (
          <TouchableHighlight
            underlayColor={colors.surface.surfaceComponent}
            onPress={handleMusicMode}
            style={dropdown.item}
          >
            <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
              <Typography numberOfLines={1}>{t('room.musicMode')}</Typography>
              {musicMode && <Icon color={colorPalette.primary400} name='checkmark' size={16} />}
            </Flex>
          </TouchableHighlight>
        )}
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => {
            console.log('===> Adjust settings');
            setMenuOpened(false);
          }}
          style={dropdown.item}
        >
          <Typography numberOfLines={1}>{t('room.adjustSettings')}</Typography>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => {
            console.log('===> View all users');
            setMenuOpened(false);
          }}
          style={dropdown.item}
        >
          <Typography numberOfLines={1}>{t('room.viewAllUsers')}</Typography>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => {
            console.log('===> Share feedback');
            setMenuOpened(false);
          }}
          style={dropdown.item}
        >
          <Typography numberOfLines={1}>{t('room.shareFeedback')}</Typography>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => {
            console.log('===> Report this room');
            setMenuOpened(false);
          }}
          style={dropdown.item}
        >
          <Typography numberOfLines={1}>{t('room.reportThisRoom')}</Typography>
        </TouchableHighlight>
        {currentRole === 'host' && (
          <TouchableHighlight
            underlayColor={colors.surface.surfaceComponent}
            onPress={handleEndRoom}
            style={dropdown.item}
          >
            <Typography color='textError' numberOfLines={1}>
              {t('room.endRoom')}
            </Typography>
          </TouchableHighlight>
        )}
      </Flex>
    </Popover>
  );
};

export default memo(RoomMenu);

const dropdown = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.buttonDefaultNormal,
    padding: 4,
    alignSelf: 'baseline',
    width: normalize(200),
  },
  item: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: normalize(12),
  },
});
