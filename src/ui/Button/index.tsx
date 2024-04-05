import { memo, type FC, useCallback } from 'react';
import { Pressable, type PressableStateCallbackType, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { ButtonSizesWithEqualPaddings, type ButtonProps, ButtonVariantsWithInverted } from './types';
import { containerStyles, iconSize, contentStyles } from './style';

const Button: FC<ButtonProps> = ({
  type = 'primary',
  size = 'md',
  text,
  iconPosition,
  iconName,
  colorInverted,
  disabled,
  style,
  active = false,
  ...props
}) => {
  const containerSize: ButtonSizesWithEqualPaddings = type === 'link' || type === 'text' ? `${size}-eq` : size;
  const variant: ButtonVariantsWithInverted = colorInverted ? `${type}-inverted` : type;

  const getContainerStyles = useCallback(
    (state: PressableStateCallbackType) => {
      return [
        containerStyles.base,
        containerStyles[containerSize],
        containerStyles[variant],
        active && containerStyles[`${variant}-active`],
        state.pressed && containerStyles[`${variant}-pressed`],
        disabled && containerStyles[`${variant}-disabled`],
        style,
      ];
    },
    [containerSize, disabled, variant, style, active],
  );

  const getContentStyles = useCallback(
    (pressed: boolean) => {
      return [
        contentStyles.base,
        contentStyles[size],
        contentStyles[variant],
        active && contentStyles[`${variant}-active`],
        pressed && contentStyles[`${variant}-pressed`],
        disabled && contentStyles[`${variant}-disabled`],
      ];
    },
    [disabled, size, variant, active],
  );

  return (
    <Pressable style={getContainerStyles} disabled={disabled} {...props}>
      {({ pressed }) => {
        let iconColor = contentStyles[variant]?.color;
        if (active) {
          iconColor = contentStyles[`${variant}-active`]?.color;
        }
        if (pressed) {
          iconColor = contentStyles[`${variant}-pressed`]?.color;
        }
        if (disabled) {
          iconColor = contentStyles[`${variant}-disabled`]?.color;
        }
        return (
          <>
            {iconPosition === 'left' && <Icon color={iconColor} size={iconSize[size]} name={iconName} />}
            <Text style={getContentStyles(pressed)}>{text}</Text>
            {iconPosition === 'right' && <Icon color={iconColor} size={iconSize[size]} name={iconName} />}
          </>
        );
      }}
    </Pressable>
  );
};

export default memo(Button);
