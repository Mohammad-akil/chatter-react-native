import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Switch } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import Typography from '~/ui/Typography';
import { colorPalette } from '~/styles/colors';
import Button from '~/ui/Button';

const DiscoverabilityAndContacts = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState(false);
  const [phone, setPhone] = useState(false);
  const [contacts, setContacts] = useState(false);
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('settings.discoverility')} />
      <ScrollView>
        <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          <Flex flexDirection='row' justifyContent='space-between'>
            <Typography type='label' size='large'>
              {t('settings.letOthersPeopleByEmail')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setEmail}
              value={email}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between'>
            <Typography type='label' size='large'>
              {t('settings.letOthersPeopleByPhone')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setPhone}
              value={phone}
            />
          </Flex>
          <Flex gap={7}>
            <Flex flexDirection='row' justifyContent='space-between'>
              <Typography type='label' size='large'>
                {t('settings.syncAddressBook')}
              </Typography>
              <Switch
                trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
                onValueChange={setContacts}
                value={contacts}
              />
            </Flex>
            <Typography style={styles.privacyContainer} color='primary500' onPress={() => {}} size='semibold'>
              {t('settings.seeOurPrivacy')}
            </Typography>
          </Flex>
          <Button style={styles.removeButton} text={t('settings.removeAllContacts')} type='cancel' />
          <Typography size='default' color='grey300'>
            {t('settings.removeAnyContacts')}
          </Typography>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
  },
  buttonLink: {
    paddingVertical: 8,
  },
  privacyContainer: { paddingVertical: 7 },
  removeButton: {
    borderWidth: 0,
  },
});
export default memo(DiscoverabilityAndContacts);
