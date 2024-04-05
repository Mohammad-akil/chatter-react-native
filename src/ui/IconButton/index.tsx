import { memo, useCallback, forwardRef } from 'react';
import { Pressable, View, type PressableStateCallbackType } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { IconButtonVariantsWithInverted, type IconButtonProps } from './types';
import { badgeStyle, containerStyles, contentStyles, iconSize } from './style';
import Flex from '../Flex';
import Typography from '../Typography';
import { normalize } from '~/utils/normalize';

const IconButton = memo(
  forwardRef<View, IconButtonProps>(
    (
      {
        type = 'secondary',
        size = 'xl',
        borderRadius = 'full',
        colorInverted,
        iconName,
        disabled,
        sizeOfIcon,
        colorOfIcon,
        style,
        active = false,
        badgeCount = 0,
        //@ts-ignore
        requested = false,
        transparent = false,
        //@ts-ignore
        on = false,
        ...props
      },
      ref,
    ) => {
      const variant: IconButtonVariantsWithInverted = colorInverted ? `${type}-inverted` : type;
      const roomControlVariant = colorInverted ? 'room-control-inverted' : 'room-control';
      const getContainerStyles = useCallback(
        (state: PressableStateCallbackType) => {
          return [
            containerStyles[size],
            containerStyles[borderRadius],
            containerStyles[variant],
            transparent && { backgroundColor: 'transparent' },
            active && containerStyles[`${variant}-active`],
            requested && containerStyles[`${roomControlVariant}-requested`],
            on && containerStyles[`${roomControlVariant}-on`],
            state.pressed && containerStyles[`${variant}-pressed`],
            disabled && containerStyles[`${variant}-disabled`],
            style,
          ];
        },
        [variant, roomControlVariant, size, disabled, requested, on, active, style, borderRadius, transparent],
      );

      return (
        <Pressable style={getContainerStyles} disabled={disabled} ref={ref} {...props}>
          {({ pressed }) => {
            let iconColor = contentStyles[variant]?.color;
            if (active) {
              iconColor = contentStyles[`${variant}-active`]?.color;
            }
            if (requested) {
              iconColor = contentStyles[`${roomControlVariant}-requested`]?.color;
            }
            if (on) {
              iconColor = contentStyles[`${roomControlVariant}-on`]?.color;
            }
            if (pressed) {
              iconColor = contentStyles[`${variant}-pressed`]?.color;
            }
            if (disabled) {
              iconColor = contentStyles[`${variant}-disabled`]?.color;
            }
            return (
              <>
                {!!badgeCount && (
                  <Flex justifyContent='center' alignItems='center' style={badgeStyle.wrapper}>
                    <Typography type='body' size='small'>
                      {badgeCount}
                    </Typography>
                  </Flex>
                )}
                <Icon
                  color={colorOfIcon ? colorOfIcon : iconColor}
                  size={sizeOfIcon ? normalize(sizeOfIcon) : iconSize[size]}
                  name={iconName}
                />
              </>
            );
          }}
        </Pressable>
      );
    },
  ),
);

export default IconButton;
