import { type FC, memo, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import Flex from '../Flex';
import Typography from '../Typography';
import Button from '../Button';
import IconButton from '../IconButton';

import type { CustomToastConfig, CustomToastProps } from './types';
import { toast, toastBackground, toastText } from './style';

const CustomToast: FC<CustomToastProps> = memo(({ text1, text2, type, hide, props }) => {
  const { t } = useTranslation();
  const {
    withButtons,
    withTopRightButton,
    acceptButtonText = t('common.okay'),
    dismissButtonText = t('common.dismiss'),
    onOpenLink,
    onAccept,
    onDismiss,
  } = props;
  const { width } = useWindowDimensions();
  const containerStyles = [toast.base, { width: width - 40 }, toastBackground[type]];

  const dismiss = useCallback(() => {
    onDismiss?.();
    hide();
  }, [hide, onDismiss]);

  const accept = useCallback(() => {
    onAccept?.();
    hide();
  }, [hide, onAccept]);

  const openLink = useCallback(() => {
    onOpenLink?.();
    hide();
  }, [hide, onOpenLink]);

  const renderTopRightIcon = useCallback(() => {
    switch (withTopRightButton) {
      case 'close':
        return (
          <IconButton
            type={`toast-${type}`}
            style={toast.closeIcon}
            iconName='close-outline'
            size='lg'
            onPress={dismiss}
          />
        );

      case 'link':
        return (
          <IconButton
            type={`toast-${type}`}
            style={toast.closeIcon}
            iconName='open-outline'
            size='md'
            onPress={openLink}
          />
        );

      default:
        return undefined;
    }
  }, [withTopRightButton, type, dismiss, openLink]);

  return (
    <Flex gap={8} style={containerStyles}>
      <Flex flex={1} gap={6} justifyContent='space-between' alignItems='flex-start' flexDirection='row'>
        <Typography style={[toastText[type], { flex: 1 }]} type='label' size='medium'>
          {text1}
        </Typography>
        {renderTopRightIcon()}
      </Flex>
      {text2 && (
        <Typography style={toastText[type]} type='body' size='default'>
          {text2}
        </Typography>
      )}
      {withButtons && (
        <Flex justifyContent='flex-end' flexDirection='row' gap={10}>
          <Button type={`toast-${type}`} size='sm' text={dismissButtonText} onPress={dismiss} />
          <Button type={`toast-outlined-${type}`} size='sm' text={acceptButtonText} onPress={accept} />
        </Flex>
      )}
    </Flex>
  );
});

export const toastConfig: CustomToastConfig = {
  normal: (params) => {
    const { type, ...restParams } = params;
    return <CustomToast type='normal' {...restParams} />;
  },
  error: (params) => {
    const { type, ...restParams } = params;
    return <CustomToast type='error' {...restParams} />;
  },
};
