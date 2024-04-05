import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import Typography from '~/ui/Typography';
import { Switch } from 'react-native';
import { colorPalette } from '~/styles/colors';

const SMSNotifications = () => {
  const { t } = useTranslation();
  const [creator, setCreator] = useState(false);
  const [events, setEvents] = useState(false);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        style={commonStyles.baseScreenPadding}
        withBackButton={true}
        title={t('settings.smsNotifications')}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Flex gap={4} style={styles.descriptionContainer}>
              <Typography type='label' size='large'>
                {t('common.chatterCreator')}
              </Typography>
              <Typography size='default' color='grey300'>
                {t('settings.changesSubscriptions')}
              </Typography>
            </Flex>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setCreator}
              value={creator}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='label' size='large'>
              {t('settings.chatterLiveEvents')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setEvents}
              value={events}
            />
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
    paddingBottom: normalize(80),
  },
  descriptionContainer: { maxWidth: '50%' },
});

export default memo(SMSNotifications);
