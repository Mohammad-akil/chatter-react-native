import { memo, useCallback, useState } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import Popover from 'react-native-popover-view';
import { t } from 'i18next';

import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Flex from '~/ui/Flex';

import { colors } from '~/styles/colors';
import { commonPopover } from '~/styles';

const popoverAnimation = { duration: 300 };

const DMThreadMenu = () => {
  const [menuOpened, setMenuOpened] = useState(false);

  const popoverStyle = [
    commonPopover.base,
    commonPopover.noBackground,
    { transform: [{ translateX: -10 }, { translateY: 8 }] },
  ];

  const toggleMenu = useCallback(() => {
    setMenuOpened((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpened(false);
  }, []);

  return (
    <Popover
      isVisible={menuOpened}
      onRequestClose={closeMenu}
      arrowSize={commonPopover.arrow}
      popoverStyle={popoverStyle}
      animationConfig={popoverAnimation}
      backgroundStyle={commonPopover.noBackground}
      offset={2}
      from={<IconButton type='secondary' iconName='ellipsis-horizontal' onPress={toggleMenu} />}
    >
      <Flex style={dropdown.base}>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => {
            console.log('===> Manage members');
            setMenuOpened(false);
          }}
          style={dropdown.item}
        >
          <Typography numberOfLines={1}>{t('chat.manage')}</Typography>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => {
            console.log('===> Start private room ');
            setMenuOpened(false);
          }}
          style={dropdown.item}
        >
          <Typography numberOfLines={1}>{t('chat.private')}</Typography>
        </TouchableHighlight>
      </Flex>
    </Popover>
  );
};

export default memo(DMThreadMenu);

const dropdown = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.buttonDefaultNormal,
    padding: 4,
    alignSelf: 'baseline',
    width: 200,
  },
  item: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
});
