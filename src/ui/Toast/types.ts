import { ToastConfigParams, ToastProps, ToastShowParams } from 'react-native-toast-message';

type ToastVariants = 'normal' | 'error';

type AdditionalToastWithButtonsProps =
  | {
      withButtons: true;
      acceptButtonText?: string;
      dismissButtonText?: string;
      onAccept: () => void;
      onDismiss: () => void;
    }
  | {
      withButtons: false;
      onAccept: undefined;
      onDismiss: undefined;
      acceptButtonText: undefined;
      dismissButtonText: undefined;
    };

type AdditionalToastPropsWithTopRightButtonProps =
  | { withTopRightButton: undefined; onOpenLink: undefined }
  | {
      withTopRightButton: 'link';
      onOpenLink: () => void;
    }
  | {
      withTopRightButton: 'close';
      onOpenLink: undefined;
    };

type AdditionalToastProps = AdditionalToastWithButtonsProps & AdditionalToastPropsWithTopRightButtonProps;

export type CustomToastProps = {
  type: ToastVariants;
} & Omit<ToastConfigParams<AdditionalToastProps>, 'type'> &
  ToastProps;

export type CustomToastConfig = {
  [K in ToastVariants]: (params: ToastConfigParams<AdditionalToastProps>) => JSX.Element;
};

export type CustomShowParams = {
  type: ToastVariants;
  props: AdditionalToastProps;
} & Omit<ToastShowParams, 'type' | 'props'>;
