import { memo, useCallback, useState, useMemo, useEffect } from 'react';
import { StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import Popover from 'react-native-popover-view';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import { RoomPrivacyOld } from '~/entities/Room';

import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';

import { getPrivacyOptions } from './options';
import { roomState } from '../../state';

import { normalize } from '~/utils/normalize';
import { Language } from '~/i18n/types';
import { colors, colorPalette } from '~/styles/colors';
import { commonPopover, commonStyles } from '~/styles';

const popoverAnimation = { duration: 300 };
const dropdownIconAnimation = { duration: 200 };

const PrivacySelect = () => {
  const { t, i18n } = useTranslation();
  const [roomData, setRoomData] = useRecoilState(roomState);
  const [menuOpened, setMenuOpened] = useState(false);

  const popoverStyle = [commonPopover.base, commonPopover.noBackground];

  const iconRotate = useSharedValue(0);
  const iconStyle = useAnimatedStyle(() => {
    return { transform: [{ rotateX: `${interpolate(iconRotate.value, [0, 1], [0, 180])}deg` }] };
  });

  useEffect(() => {
    if (menuOpened) {
      iconRotate.value = withTiming(1, dropdownIconAnimation);
    } else {
      iconRotate.value = withTiming(0, dropdownIconAnimation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpened]);

  const toggleMenu = useCallback(() => {
    setMenuOpened((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpened(false);
  }, []);

  const handleSelectItem = useCallback(
    (item: RoomPrivacyOld) => {
      setRoomData((currentState) => {
        return {
          ...currentState,
          privacy: item,
        };
      });
      setMenuOpened(false);
    },
    [setRoomData],
  );

  const privacyOptions = useMemo(() => getPrivacyOptions(i18n.language as Language), [i18n.language]);

  return (
    <Popover
      isVisible={menuOpened}
      onRequestClose={closeMenu}
      arrowSize={commonPopover.arrow}
      popoverStyle={popoverStyle}
      animationConfig={popoverAnimation}
      offset={14}
      backgroundStyle={commonPopover.noBackground}
      from={
        <TouchableOpacity style={commonStyles.flexCenter} onPress={toggleMenu}>
          <Flex flexDirection='row' alignItems='center' gap={4}>
            <Typography type='label' size='small' color='white'>
              {privacyOptions[roomData.privacy].label}
            </Typography>
            <Animated.View style={iconStyle}>
              <Icon name='chevron-down-outline' onPress={toggleMenu} size={normalize(20)} color={colorPalette.grey50} />
            </Animated.View>
          </Flex>
        </TouchableOpacity>
      }
    >
      <Flex style={dropdown.base}>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => handleSelectItem('open')}
          style={[dropdown.item, roomData.privacy === 'open' && dropdown.itemSelected]}
        >
          <Typography type='label' size='small' numberOfLines={1}>
            {t('room.public')}
          </Typography>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => handleSelectItem('private')}
          style={[dropdown.item, roomData.privacy === 'private' && dropdown.itemSelected]}
        >
          <Typography type='label' size='small' numberOfLines={1}>
            {t('room.private')}
          </Typography>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => handleSelectItem('subscribers')}
          style={[dropdown.item, roomData.privacy === 'subscribers' && dropdown.itemSelected]}
        >
          <Typography type='label' size='small' numberOfLines={1}>
            {t('room.social')}
          </Typography>
        </TouchableHighlight>
      </Flex>
    </Popover>
  );
};

export default memo(PrivacySelect);

const dropdown = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.buttonDefaultNormal,
    padding: 4,
    width: normalize(160),
  },
  item: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: normalize(12),
    color: 'white',
  },
  itemSelected: {
    backgroundColor: colors.surface.surfaceComponent,
  },
});
