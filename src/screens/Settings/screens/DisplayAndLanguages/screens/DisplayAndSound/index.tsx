import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from 'react-native';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import SelectPicker from '~/components/SelectPicker';
import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';

import { normalize } from '~/utils/normalize';

const DisplayAndSound = () => {
  const { t } = useTranslation();
  const [effects, setEffects] = useState(false);
  const [sort, setSort] = useState('');

  const selectPickerStyle = { iconContainer: styles.filter };
  const sortPlaceholder = { label: 'Use device settings', value: 'Use device settings' };
  //@ts-ignore
  const itemsSortArray = [];
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        style={commonStyles.baseScreenPadding}
        withBackButton={true}
        title={t('settings.displayAndSound')}
      />
      <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Typography type='label' size='large'>
            {t('settings.displayMode')}
          </Typography>
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
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Typography type='label' size='large'>
            {t('settings.soundEffects')}
          </Typography>
          <Switch
            trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
            onValueChange={setEffects}
            value={effects}
          />
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
  },

  filter: { paddingRight: 6 },
});
export default memo(DisplayAndSound);
