import {
  type FC,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  memo,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import {
  type BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';
import { SharedValue } from 'react-native-reanimated';
import Flex from '../Flex';

type BottomSheetProps = {
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  backdropOpacity?: number;
  backgroundStyle?: StyleProp<ViewStyle>;
  contentStyles?: StyleProp<ViewStyle>;
  buttons?: ReactNode;
  children: ReactNode;
  enableDynamicSizing?: boolean;
  snapPoints?:
    | (string | number)[]
    | SharedValue<(string | number)[]>
    | Readonly<(string | number)[] | SharedValue<(string | number)[]>>
    | undefined;
  open: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  onDismiss?: () => void;
};

const BottomSheet: FC<BottomSheetProps> = ({
  backdropOpacity,
  children,
  snapPoints,
  enableDynamicSizing = true,
  open,
  setOpened,
  buttons,
  containerStyle,
  contentStyles,
  backgroundStyle,
  onDismiss,
  style,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const bottomSheetStyle = useMemo(() => {
    return [style];
  }, [style]);

  const bottomSheetModalBackground = useMemo(() => {
    return [bottomSheetModal.background, backgroundStyle];
  }, [backgroundStyle]);

  const _dismissModalState = useCallback(() => {
    onDismiss?.();
    setOpened(false);
  }, [setOpened, onDismiss]);

  useEffect(() => {
    /*
      Opening and closing of bottom sheet modal workring via ref in @gorhom/bottom-sheet library so for easier handling toggle functionality, we're using state which we are passing here. And on changing state we just call open and close functions from ref
     */
    open ? bottomSheetModalRef.current?.present() : bottomSheetModalRef.current?.close();
  }, [open]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={backdropOpacity}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior='close'
      />
    ),
    [backdropOpacity],
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        handleComponent={null}
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        containerStyle={containerStyle}
        style={bottomSheetStyle}
        detached={true}
        enableDynamicSizing={enableDynamicSizing}
        onDismiss={_dismissModalState}
        backgroundStyle={bottomSheetModalBackground}
      >
        <BottomSheetView style={[bottomSheetModal.contentWrapper, contentStyles]}>
          {buttons && <Flex>{buttons}</Flex>}
          <Flex style={bottomSheetModal.content}>{children}</Flex>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default memo(BottomSheet);

const bottomSheetModal = StyleSheet.create({
  background: {
    backgroundColor: 'transparent',
  },
  contentWrapper: {
    paddingBottom: normalize(50),
    gap: 8,
  },
  content: {
    backgroundColor: colors.surface.surfaceComponent,
    borderRadius: 8,
  },
});
