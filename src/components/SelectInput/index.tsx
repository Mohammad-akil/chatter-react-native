import { FC, memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableHighlight, TouchableOpacity, useWindowDimensions } from 'react-native';
import Popover from 'react-native-popover-view/dist/Popover';
import { Placement } from 'react-native-popover-view/dist/Types';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useChevronAnimation } from '~/hooks/useChevronAnimation';
import { commonPopover } from '~/styles';
import { colorPalette, colors } from '~/styles/colors';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';

export type SelectOption = {
  value: string;
  label: string;
};
interface SelectInputProps {
  selectKey: string;
  label?: string;
  options: SelectOption[];
  setSelectedOption: (option: SelectOption) => void;
  selectedOption: SelectOption | undefined;
}

const popoverAnimation = { duration: 300 };

const SelectInput: FC<SelectInputProps> = ({ label, options, setSelectedOption, selectedOption, selectKey }) => {
  const { width } = useWindowDimensions();
  const [active, setActive] = useState<boolean>(false);
  const { t } = useTranslation();
  const { iconStyle } = useChevronAnimation(active);
  const borderBottom = {
    borderBottomWidth: 0.5,
    borderBottomColor: active ? colorPalette.primary400 : colorPalette.grey50,
  };

  const toggleMenu = useCallback(() => {
    setActive((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setActive(false);
  }, []);

  const handleSelectItem = useCallback(
    (option: SelectOption) => {
      setSelectedOption(option);
      closeMenu();
    },
    [setSelectedOption, closeMenu],
  );
  const menuWidth = { width: width - normalize(40) };
  return (
    <Flex gap={2}>
      {label && (
        <Typography type='label' size='medium'>
          {label}
        </Typography>
      )}
      <Popover
        isVisible={active}
        onRequestClose={closeMenu}
        arrowSize={commonPopover.arrow}
        popoverStyle={styles.popoverStyle}
        animationConfig={popoverAnimation}
        placement={Placement.BOTTOM}
        offset={4}
        backgroundStyle={commonPopover.noBackground}
        from={
          <TouchableOpacity activeOpacity={0.5} onPress={toggleMenu}>
            <Flex
              flexDirection='row'
              justifyContent='space-between'
              alignItems='center'
              gap={10}
              style={[styles.inputStyle, borderBottom]}
            >
              {selectedOption ? (
                <Typography type='label' size='medium'>
                  {selectedOption.label}
                </Typography>
              ) : (
                <Typography type='label' size='medium' color='grey400'>
                  {t('common.select')}
                </Typography>
              )}
              <Animated.View style={iconStyle}>
                <Icon
                  name='chevron-down-outline'
                  onPress={toggleMenu}
                  size={normalize(20)}
                  color={colorPalette.grey50}
                />
              </Animated.View>
            </Flex>
          </TouchableOpacity>
        }
      >
        <Flex style={[menu.base, menuWidth]}>
          {options.map((option) => {
            const isSelected = selectedOption?.value === option.value;
            const selectOption = () => {
              handleSelectItem(option);
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
    </Flex>
  );
};

const styles = StyleSheet.create({
  popoverStyle: {
    ...commonPopover.base,
    ...commonPopover.noBackground,
  },
  inputStyle: { paddingVertical: normalize(12) },
});

const menu = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.buttonDefaultNormal,
    padding: 4,
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

export default memo(SelectInput);
