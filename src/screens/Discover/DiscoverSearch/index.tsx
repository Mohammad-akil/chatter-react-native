import { memo, useCallback, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { api } from '~/api';

import { SearchInput } from '~/components/SearchInput';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { useDebounce } from '~/hooks/useDebounce';
import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';

import SearchResults from './SearchResults';
import { useQuery } from '@tanstack/react-query';

const DiscoverSearch = () => {
  const { t } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();
  const { goBack } = useNavigation();

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);

  const { isPending, data } = useQuery({
    queryKey: ['discover/search', debouncedSearch],
    queryFn: () => api.search.search({ q: debouncedSearch }),
  });

  const cancelHandle = useCallback(() => {
    setSearchValue('');
    goBack();
  }, [goBack]);

  const handleOnChange = useCallback((text: string) => {
    setSearchValue(text);
  }, []);

  const scrollViewContentStyle = useMemo(() => {
    return [
      commonStyles.baseSafeArea,
      commonStyles.fullHeight,
      { paddingBottom: bottom, paddingTop: Platform.OS === 'android' ? top + normalize(20) : top },
    ];
  }, [top, bottom]);

  const handleOnSubmit = useCallback(() => {}, []);
  return (
    <SafeAreaView style={scrollViewContentStyle}>
      <Flex flexDirection='row' style={commonStyles.baseScreenPadding}>
        <Flex flex={1} style={styles.inputContainer}>
          <SearchInput autoFocus onSubmitEditing={handleOnSubmit} value={searchValue} onChangeText={handleOnChange} />
        </Flex>
        <Button type='text' text={t('common.cancel')} onPress={cancelHandle} />
      </Flex>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={commonStyles.baseScrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <SearchResults searchValue={searchValue} loading={isPending} searchResults={data} />
      </ScrollView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  inputContainer: { paddingBottom: 8, paddingTop: normalize(10) },
  scrollViewContent: {
    paddingTop: normalize(24),
    gap: normalize(24),
  },
});
export default memo(DiscoverSearch);
