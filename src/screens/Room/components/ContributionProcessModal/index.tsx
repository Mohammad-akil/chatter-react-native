import { type FC, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type StyleProp, type ViewStyle, StyleSheet, Modal } from 'react-native';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { contributionProcessState as _contributionProcessState } from '~/screens/Room/state/chatState';
import { commonStyles } from '~/styles';
import { colors } from '~/styles/colors';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';

type ContributionProcessModalProps = {
  style?: StyleProp<ViewStyle>;
  state: 'PROCESSING' | 'ERROR';
  tryAgain: () => void;
};

const ContributionInProcess = memo(() => {
  const { t } = useTranslation();
  return (
    <Flex style={styles.modalView} gap={16}>
      <Flex gap={8}>
        <Typography color='textLabel' type='headline' size='small'>
          {t('room.processing')}...
        </Typography>
        <Typography color='textSecondary' type='body' size='semibold'>
          {t('room.oneMoment')}
        </Typography>
      </Flex>
    </Flex>
  );
});

const ContributionUnsuccessful = memo((props: { closeModal: () => void; tryAgain: () => void }) => {
  const { closeModal, tryAgain } = props;
  const setConstributionProcess = useSetRecoilState(_contributionProcessState);
  const { t } = useTranslation();

  const editContribution = useCallback(() => {
    setConstributionProcess(null);
  }, [setConstributionProcess]);

  const onTryAgain = useCallback(() => {
    setConstributionProcess('PROCESSING');
    tryAgain();
  }, [tryAgain, setConstributionProcess]);

  return (
    <Flex style={styles.modalView} gap={16}>
      <Flex gap={8}>
        <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
          <Typography color='textLabel' type='headline' size='small'>
            {t('room.paymentUnsuccessful')}
          </Typography>
          <IconButton type='text' iconName='close' sizeOfIcon={24} style={styles.closeButton} onPress={closeModal} />
        </Flex>
        <Typography type='body' size='default' color='textDefault'>
          {t('room.weRanIntoAnIssue')}
        </Typography>
      </Flex>
      <Flex flexDirection='row' gap={6}>
        <Button
          style={commonStyles.flexFull}
          type='ghost'
          text={t('room.editContribution')}
          onPress={editContribution}
        />
        <Button style={commonStyles.flexFull} type='primary' text={t('common.tryAgain')} onPress={onTryAgain} />
      </Flex>
    </Flex>
  );
});

const ContributionProcessModal: FC<ContributionProcessModalProps> = ({ tryAgain }) => {
  const [constributionProcess, setConstributionProcess] = useRecoilState(_contributionProcessState);
  const closeModal = useCallback(() => {
    setConstributionProcess(null);
  }, [setConstributionProcess]);

  return (
    <Modal
      key='contributionProcessModal'
      animationType='fade'
      transparent={true}
      visible={true}
      onRequestClose={closeModal}
    >
      <Flex style={styles.modalBackground} justifyContent='center' alignItems='center' flex={1}>
        {constributionProcess === 'PROCESSING' && <ContributionInProcess />}
        {constributionProcess === 'ERROR' && <ContributionUnsuccessful closeModal={closeModal} tryAgain={tryAgain} />}
      </Flex>
    </Modal>
  );
};

export default memo(ContributionProcessModal);

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: colors.overlay.modal,
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
});
