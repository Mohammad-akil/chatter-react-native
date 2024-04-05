import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import Avatar from '~/ui/Avatar';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';

const MutedAccounts = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('settings.mutedAccounts')} />
      <ScrollView>
        <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          <Flex flexDirection='row' justifyContent='space-between'>
            <Flex flexDirection='row' alignItems='center' gap={4}>
              <Avatar size={48} url={'https://i.pinimg.com/736x/78/48/29/7848297c04b1d0f4d927b8b9047d7631.jpg'} />
              <Flex justifyContent='center'>
                <Typography style={styles.textPadding} type='label' size='medium'>
                  Yasmine Doe
                </Typography>

                <Typography style={styles.textPadding} color='grey300' type='label' size='small'>
                  @yasmine
                </Typography>
              </Flex>
            </Flex>
            <Flex justifyContent='center'>
              <Button size='sm' type='secondary' text={t('common.unmute')} />
            </Flex>
          </Flex>
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
  textPadding: { padding: 4 },
});
export default memo(MutedAccounts);
