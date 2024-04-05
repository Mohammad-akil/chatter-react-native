import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import Typography from '~/ui/Typography';
import SelectPicker from '~/components/SelectPicker';
import { colorPalette } from '~/styles/colors';

const DirectMessagesSettings = () => {
  const { t } = useTranslation();
  const [sort, setSort] = useState('');

  const selectPickerStyle = { iconContainer: styles.filter };
  const sortPlaceholder = { label: 'Everyone', value: 'Everyone' };
  //@ts-ignore
  const itemsSortArray = [];
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('common.directMessages')} />
      <ScrollView>
        <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          <Flex flexDirection='row' justifyContent='space-between'>
            <Flex gap={4} style={styles.labelContainer}>
              <Typography type='label' size='large'>
                {t('settings.allowNewMessages')}
              </Typography>
              <Typography size='default' color='grey300'>
                {t('settings.peopleYouFollow')}
              </Typography>
            </Flex>
            <Flex justifyContent='center'>
              <SelectPicker
                style={selectPickerStyle}
                placeholder={sortPlaceholder}
                //@ts-ignore
                items={itemsSortArray}
                onChangeValue={setSort}
                iconName='chevron-down-outline'
                backgroundColor={colorPalette.grey900}
              />
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
  labelContainer: { maxWidth: '50%' },
  filter: { paddingRight: 6 },
});
export default memo(DirectMessagesSettings);
