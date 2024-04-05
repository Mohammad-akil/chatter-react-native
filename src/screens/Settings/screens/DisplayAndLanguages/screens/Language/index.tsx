import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';

const languages = [
  { language: 'Arabic', id: 1 },
  { language: 'English', id: 2 },
  { language: 'French', id: 3 },
  { language: 'Spanish', id: 4 },
];

const Language = () => {
  const [selectedLanguageID, setSelectedLanguageID] = useState(2);
  const { t } = useTranslation();

  const changeLanguage = useCallback((id: number) => {
    setSelectedLanguageID(id);
  }, []);
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={t('settings.language')} />
      <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        {languages.map(({ id, language }) => {
          return (
            <TouchableOpacity onPress={() => changeLanguage(id)} key={id}>
              <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
                <Typography type='label' size='medium' color={selectedLanguageID === id ? 'primary400' : 'white'}>
                  {language}
                </Typography>
                {selectedLanguageID === id && (
                  <Icon name='checkmark' size={normalize(24)} color={colorPalette.primary400} />
                )}
              </Flex>
            </TouchableOpacity>
          );
        })}
      </Flex>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
  },
});
export default memo(Language);
