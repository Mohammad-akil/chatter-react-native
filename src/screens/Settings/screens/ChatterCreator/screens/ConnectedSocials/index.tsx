import { useNavigation } from '@react-navigation/native';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';

const ConnectedSocials = () => {
  const { t } = useTranslation();
  const navigate = useNavigation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        style={commonStyles.baseScreenPadding}
        withBackButton={true}
        title={t('settings.connectedSocials')}
      />
      <Flex gap={24} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <Flex justifyContent='space-between' flexDirection='row' alignItems='center'>
          <Flex flexDirection='row' alignItems='center' gap={16}>
            <Icon name='logo-instagram' size={24} color={colorPalette.white} />
            <Typography type='label' size='large'>
              Instagram
            </Typography>
          </Flex>
          <Button type='link' text={t('common.link')} />
        </Flex>
        <Flex justifyContent='space-between' flexDirection='row' alignItems='center'>
          <Flex flexDirection='row' alignItems='center' gap={16}>
            <Icon name='logo-twitter' size={24} color={colorPalette.white} />
            <Typography type='label' size='large'>
              X
            </Typography>
          </Flex>
          <Button type='link' text={t('common.link')} />
        </Flex>
        <Flex justifyContent='space-between' flexDirection='row' alignItems='center'>
          <Flex flexDirection='row' alignItems='center' gap={16}>
            <Icon name='logo-youtube' size={24} color={colorPalette.white} />
            <Typography type='label' size='large'>
              YouTube
            </Typography>
          </Flex>
          <Button type='link' text={t('common.link')} />
        </Flex>
      </Flex>
      <Button text='Open Social Linker' onPress={() => navigate.navigate('SocialAuth')} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
  },
});

export default memo(ConnectedSocials);
