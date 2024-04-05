import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MomentPreviewCard from '~/components/MomentPreviewCard';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import { momentsData } from '~/screens/Profile/data';
import SelectPicker from '~/components/SelectPicker';
import { colorPalette } from '~/styles/colors';

interface Moments {
  id: number;
  title: string;
  viewed: number;
  liked: number;
  previewVideo: string;
}
const Moments = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [sort, setSort] = useState('');

  const sortPlaceholder = { label: 'Sort', value: 'Sort' };
  const itemsSortArray = [{ label: 'sorted', value: 'sorted' }];
  const filterPlaceholder = { label: 'All topics', value: 'All topics' };
  const itemsFilterArray = [{ label: 'filtered', value: 'filtered' }];

  const scrollViewContentStyle = useMemo(() => {
    return [commonStyles.fullHeight, { paddingBottom: bottom, paddingTop: top }, commonStyles.baseScreenPadding];
  }, [top, bottom]);
  const listContainerStyles: StyleProp<ViewStyle> = {
    paddingBottom: Platform.OS === 'android' ? normalize(130) : normalize(100),
    alignItems: 'center',
  };
  const renderItem: ListRenderItem<Moments> = useCallback(({ item }) => {
    return (
      <MomentPreviewCard
        style={styles.moment}
        title={item.title}
        viewed={item.viewed}
        liked={item.liked}
        previewVideo={item.previewVideo}
      />
    );
  }, []);

  const selectPickerStyle = { iconContainer: styles.filter };

  return (
    <Flex style={scrollViewContentStyle}>
      <Flex flexDirection='row' style={styles.filterContainer}>
        <SelectPicker
          iconStyle={styles.filterIcon}
          style={selectPickerStyle}
          placeholder={sortPlaceholder}
          items={itemsSortArray}
          onChangeValue={setSort}
          iconName='funnel-outline'
          backgroundColor={colorPalette.grey900}
        />
        <SelectPicker
          iconStyle={styles.filterIcon}
          style={selectPickerStyle}
          placeholder={filterPlaceholder}
          items={itemsFilterArray}
          onChangeValue={setSort}
          iconName='filter-outline'
          backgroundColor={colorPalette.grey900}
        />
      </Flex>
      <Flex flex={1}>
        <FlatList
          contentContainerStyle={listContainerStyles}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          data={momentsData}
          renderItem={renderItem}
        />
      </Flex>
    </Flex>
  );
};

const styles = StyleSheet.create({
  filterContainer: { paddingTop: normalize(16), paddingBottom: normalize(24) },
  filter: { paddingRight: 6 },
  filterIcon: { marginTop: 0 },
  moment: { marginRight: 4, marginBottom: normalize(16) },
});

export default memo(Moments);
