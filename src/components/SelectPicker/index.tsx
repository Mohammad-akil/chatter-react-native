import { FC, ReactNode, memo } from 'react';
import Flex from '~/ui/Flex';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Ionicons';
import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';
import { styles } from './styles';
import { ViewStyle } from 'react-native';

interface SelectPickerProps {
  items: { label: string; value: string }[];
  placeholder?: { label: string; value: string };
  onChangeValue: (value: string) => void;
  backgroundColor?: string;
  iconStyle?: ViewStyle;
  style?: {
    inputIOSContainer?: ViewStyle;
    inputAndroidContainer?: ViewStyle;
    placeholder?: ViewStyle;
    inputIOS?: ViewStyle;
    iconContainer?: ViewStyle;
    inputAndroid?: ViewStyle;
  };
  iconName?: string;
  iconSize?: number;
}

const SelectPicker: FC<SelectPickerProps> = ({
  onChangeValue,
  items,
  placeholder,
  style,
  iconName,
  iconSize,
  backgroundColor,
  iconStyle,
}) => {
  const name = iconName ? iconName : 'chevron-down-outline';
  const size = iconSize ? iconSize : normalize(20);
  const selectBackgroundColor = backgroundColor ? backgroundColor : colorPalette.grey700;
  const iconContainerStyle = iconStyle ? iconStyle : styles.icon;
  const viewContainerStyle = {
    backgroundColor: selectBackgroundColor,
    borderRadius: 6,
  };
  const icon = (() => (
    <Flex style={iconContainerStyle}>
      <Icon size={size} color={colorPalette.grey50} name={name} />
    </Flex>
  )) as unknown as ReactNode;

  const selectPickerStyles = {
    viewContainer: viewContainerStyle,
    inputIOSContainer: styles.inputIOSContainer,
    inputAndroidContainer: styles.inputAndroidContainer,
    placeholder: styles.placeholder,
    inputIOS: styles.inputIOS,
    iconContainer: styles.iconContainer,
    inputAndroid: styles.inputAndroid,
    ...style,
  };

  return (
    <RNPickerSelect
      //@ts-ignore
      Icon={icon}
      darkTheme={true}
      fixAndroidTouchableBug={true}
      useNativeAndroidPickerStyle={false}
      placeholder={placeholder}
      style={selectPickerStyles}
      onValueChange={(value) => onChangeValue(value)}
      items={items}
    />
  );
};

export default memo(SelectPicker);
