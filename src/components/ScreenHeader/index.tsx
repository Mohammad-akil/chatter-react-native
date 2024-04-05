import { useNavigation } from '@react-navigation/native';
import { type FC, memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import type { ScreenHeaderProps } from './types';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';

const hitSlop = { left: 5, right: 5, bottom: 5, top: 5 };

const ScreenHeader: FC<ScreenHeaderProps> = ({
  style,
  title,
  titleSize = 'medium',
  color,
  subTitle,
  titleProps,
  subTitleProps,
  description,
  withBackButton,
  backButtonProps,
  backIcon = 'chevron-back-outline',
  onBack,
  children,
}) => {
  const { goBack } = useNavigation();

  const containerStyles = [styles.wrapper, style];

  return (
    <View style={containerStyles}>
      <Flex flexDirection='row' justifyContent='space-between'>
        <View style={styles.left}>
          {withBackButton && backIcon && (
            <IconButton
              onPress={onBack ?? goBack}
              hitSlop={hitSlop}
              iconName={backIcon}
              type='text'
              size='lg'
              style={styles.button}
              {...backButtonProps}
            />
          )}
          <Typography type='headline' size={titleSize} color={color} {...titleProps}>
            {title}
          </Typography>
        </View>
        <Flex flexDirection='row' gap={8}>
          {children}
        </Flex>
      </Flex>
      {subTitle && (
        <Typography type='body' size='semibold' color='grey300' {...subTitleProps}>
          {subTitle}
        </Typography>
      )}
      {description && (
        <Flex flexWrap='wrap' flexDirection='row'>
          {description}
        </Flex>
      )}
    </View>
  );
};

export default memo(ScreenHeader);
