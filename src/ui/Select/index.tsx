import { type FC, memo, useState, useCallback } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Placement } from 'react-native-popover-view/dist/Types';
import Popover from 'react-native-popover-view/dist/Popover';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';

import { useChevronAnimation } from './useChevronAnimaton';
import Typography from '../Typography';
import Flex from '../Flex';

import { normalize } from '~/utils/normalize';
import { colorPalette, colors } from '~/styles/colors';
import { commonPopover, commonStyles } from '~/styles';

const popoverAnimation = { duration: 300 };

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  selectKey: string; // IMPORTANT
  style?: StyleProp<ViewStyle>;
  selectedOption: SelectOption;
  setSelectedOption: (option: SelectOption) => void;
  options: SelectOption[];
};

const Select: FC<SelectProps> = ({ selectKey, selectedOption, setSelectedOption, options }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const { iconStyle } = useChevronAnimation(menuOpened);

  const toggleMenu = useCallback(() => {
    setMenuOpened((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpened(false);
  }, []);

  const hadnleSelectItem = useCallback(
    (option: SelectOption) => {
      setSelectedOption(option);
      closeMenu();
    },
    [setSelectedOption, closeMenu],
  );

  return (
    <Popover
      isVisible={menuOpened}
      onRequestClose={closeMenu}
      arrowSize={commonPopover.arrow}
      popoverStyle={styles.popoverStyle}
      animationConfig={popoverAnimation}
      placement={Placement.BOTTOM}
      offset={14}
      backgroundStyle={commonPopover.noBackground}
      from={
        <TouchableOpacity style={commonStyles.flexCenter} activeOpacity={0.8} onPress={toggleMenu}>
          <Flex flexDirection='row' alignItems='center' gap={4}>
            <Typography type='label' size='small' color='white'>
              {selectedOption?.label}
            </Typography>
            <Animated.View style={iconStyle}>
              <Icon name='chevron-down-outline' onPress={toggleMenu} size={normalize(20)} color={colorPalette.grey50} />
            </Animated.View>
          </Flex>
        </TouchableOpacity>
      }
    >
      <Flex style={menu.base}>
        {options.map((option) => {
          const isSelected = selectedOption.value === option.value;
          const selectOption = () => {
            hadnleSelectItem(option);
          };

          return (
            <TouchableHighlight
              key={`${selectKey}${option.value}`}
              underlayColor={colors.surface.surfaceComponent}
              style={[menu.item, isSelected && menu.itemSelected]}
              onPress={selectOption}
            >
              <Typography type='label' size='small' numberOfLines={1}>
                {option.label}
              </Typography>
            </TouchableHighlight>
          );
        })}
      </Flex>
    </Popover>
  );
};

export default memo(Select);

const styles = StyleSheet.create({
  popoverStyle: {
    ...commonPopover.base,
    ...commonPopover.noBackground,
  },
});

const menu = StyleSheet.create({
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
