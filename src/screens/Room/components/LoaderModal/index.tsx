import { type FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { type StyleProp, type ViewStyle, StyleSheet, Modal } from 'react-native';
import { colorPalette, colors } from '~/styles/colors';
import ChatterIcon from '~/ui/ChatterIcon';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';

type LoaderModalProps = {
  style?: StyleProp<ViewStyle>;
};

const LoaderModal: FC<LoaderModalProps> = ({ style }) => {
  const { t } = useTranslation();
  return (
    <Modal key='loaderModal' animationType='fade' transparent={true} visible={true} style={style}>
      <Flex flex={1} style={styles.modalBackground} justifyContent='center' alignItems='center'>
        <ChatterIcon name='chatter-primary-logo' size={40} color={colorPalette.primary400} />
        <Typography type='headline' size='medium'>
          {t('common.oneMoment')}...
        </Typography>
      </Flex>
    </Modal>
  );
};

export default memo(LoaderModal);

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: colors.overlay.modal,
    paddingHorizontal: normalize(20),
  },
});
