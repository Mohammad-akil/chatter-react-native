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

const NotificationsRooms = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState(false);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        style={commonStyles.baseScreenPadding}
        withBackButton={true}
        title={t('settings.pushNotifications') + ': ' + t('settings.rooms')}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='label' size='large'>
              {t('settings.rooms')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setRooms}
              value={rooms}
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

export default memo(NotificationsRooms);
