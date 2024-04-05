import { type FC, memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type StyleProp, type ViewStyle, StyleSheet, Modal } from 'react-native';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { colorPalette, colors } from '~/styles/colors';
import Flex from '~/ui/Flex';
import { TextInput } from '~/ui/TextInput';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import { clipMomentState } from '../../state/clipMomentState';
import Button from '~/ui/Button';
import { commonStyles } from '~/styles';
import { state } from '../../state/roomState';
import IconButton from '~/ui/IconButton';
import { useNavigation } from '@react-navigation/native';

type TitleYourClipModalProps = {
  style?: StyleProp<ViewStyle>;
  createMoment: () => void;
};

const TitleYourClip = memo(({ createMoment }: { createMoment: () => void }) => {
  const { t } = useTranslation();
  const setTitle = useSetRecoilState(clipMomentState.momentTitleState);

  const handleChangeText = useCallback(
    (text: string) => {
      setTitle(text);
    },
    [setTitle],
  );

  const setCreateModalOpened = useSetRecoilState(clipMomentState.createMomentModalOpenedState);

  const close = useCallback(() => {
    setCreateModalOpened(false);
  }, [setCreateModalOpened]);

  return (
    <Flex style={styles.modalView} gap={16}>
      <Typography type='label' size='medium'>
        {t('room.titleYourClip')}
      </Typography>
      <TextInput autoFocus withBorder placeholder={t('room.enterMomentTitle')} onChangeText={handleChangeText} />
      <Flex flexDirection='row' gap={6}>
        <Button style={commonStyles.flexFull} size='md' type='cancel' text={t('common.cancel')} onPress={close} />
        <Button style={commonStyles.flexFull} size='md' text={t('common.finish')} onPress={createMoment} />
      </Flex>
    </Flex>
  );
});

const MomentUploading = memo(() => {
  const { t } = useTranslation();
  const roomDetails = useRecoilValue(state.roomDetailsState);
  return (
    <Flex alignItems='center' gap={8}>
      <Typography textAlign='center' type='headline' size='medium' color='textLabel'>
        {t('room.momentUploading')}
      </Typography>
      <Typography textAlign='center' color='warning300' type='body' size='default'>
        {t('room.weWillNotifyYou')}
      </Typography>
      <Typography textAlign='center' type='body' size='default' color='textLabel'>
        {t('room.momentUploading')}
        {t('room.saveAndShareYourMoment')} "{roomDetails?.title}"
      </Typography>
      <Flex flexDirection='row' gap={8}>
        <IconButton iconName='download-outline' type='secondary' size='3xl' />
        <IconButton iconName='share-outline' type='secondary' size='3xl' />
      </Flex>
    </Flex>
  );
});

const MomentCreated = memo(() => {
  const { t } = useTranslation();
  const roomDetails = useRecoilValue(state.roomDetailsState);
  return (
    <Flex alignItems='center' gap={8}>
      <Typography textAlign='center' type='headline' size='medium' color='textLabel'>
        {t('room.momentCreated')}
      </Typography>
      <Typography textAlign='center' type='body' size='default' color='textLabel'>
        {t('room.saveAndShareYourMoment')} "{roomDetails?.title}"
      </Typography>
      <Flex flexDirection='row' gap={8}>
        <IconButton iconName='download-outline' type='secondary' size='3xl' />
        <IconButton iconName='share-outline' type='secondary' size='3xl' />
      </Flex>
    </Flex>
  );
});

const CreateMomentModal: FC<TitleYourClipModalProps> = ({ createMoment }) => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const creatingMomentState = useRecoilValue(clipMomentState.creatingMoment);

  const clearMomentTitleState = useResetRecoilState(clipMomentState.momentTitleState);
  const clearCreatingMomentState = useResetRecoilState(clipMomentState.creatingMoment);

  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);

  const goBackWhenSuccess = useCallback(() => {
    goBack();
    clearCreatingMomentState();
    clearMomentTitleState();
    setRoomControlsOpened(true);
  }, [goBack, clearCreatingMomentState, clearMomentTitleState, setRoomControlsOpened]);

  const goBackWhenUploading = useCallback(() => {
    goBack();
    setRoomControlsOpened(true);
  }, [goBack, setRoomControlsOpened]);

  return (
    <Modal key='titleYourClipModal' animationType='fade' transparent={true} visible={true}>
      <Flex style={styles.modalBackground} justifyContent='center' alignItems='center' flex={1}>
        {!creatingMomentState && <TitleYourClip createMoment={createMoment} />}
        {creatingMomentState === 'UPLOADING' && (
          <>
            <MomentUploading />
            <Button
              size='lg'
              text={t('room.doneTakeMeBack')}
              style={styles.bottomButton}
              onPress={goBackWhenUploading}
            />
          </>
        )}
        {creatingMomentState === 'SUCCESS' && (
          <>
            <MomentCreated />
            <Button size='lg' text={t('room.doneTakeMeBack')} style={styles.bottomButton} onPress={goBackWhenSuccess} />
          </>
        )}
      </Flex>
    </Modal>
  );
};

export default memo(CreateMomentModal);

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: '#000000E5',
    paddingHorizontal: normalize(20),
  },
  modalView: {
    backgroundColor: colors.surface.surfaceComponent,
    padding: normalize(16),
    borderRadius: 6,
    width: '100%',
  },
  closeButton: {
    borderRadius: 6,
    paddingBottom: 3,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  bottomButton: {
    position: 'absolute',
    width: '100%',
    bottom: normalize(48),
    ...commonStyles.flexFull,
  },
});
