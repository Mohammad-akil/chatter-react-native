import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import RoomPreviewCard from '~/components/RoomPreviewCard';
import { roomsData } from '~/screens/Home/data';
import { Room, RoomOld } from '~/entities/Room';
import SelectPicker from '~/components/SelectPicker';
import { normalize } from '~/utils/normalize';
import { useTranslation } from 'react-i18next';
import { colorPalette } from '~/styles/colors';

const Rooms = () => {
  const [filter, setFilter] = useState('upcoming');

  const [sort, setSort] = useState('');

  const sortPlaceholder = { label: 'Sort', value: 'Sort' };
  const itemsSortArray = [{ label: 'sorted', value: 'sorted' }];
  const filterPlaceholder = { label: 'All topics', value: 'All topics' };
  const itemsFilterArray = [{ label: 'filtered', value: 'filtered' }];

  const { top, bottom } = useSafeAreaInsets();
  const { t } = useTranslation();
  const itemsArray = [{ label: t('discover.live'), value: 'live' }];
  const pickerPlaceholder = { label: t('discover.upcoming'), value: 'upcoming' };

  const scrollViewContentStyle = useMemo(() => {
    return [commonStyles.fullHeight, { paddingBottom: bottom, paddingTop: top }, commonStyles.baseScreenPadding];
  }, [top, bottom]);
  const renderItem: ListRenderItem<Room> = useCallback(
    ({ item }) => {
      if (item.status === 'active' && filter === 'live') {
        return (
          <Flex style={styles.room}>
            <RoomPreviewCard key={item.id} room={item} isList={true} />
          </Flex>
        );
      } else if (item.status === 'scheduled' && filter === 'upcoming') {
        return (
          <Flex style={styles.room}>
            <RoomPreviewCard key={item.id} room={item} isList={true} />
          </Flex>
        );
      }
      return null;
    },
    [filter],
  );
  const listContainerStyles: StyleProp<ViewStyle> = {
    paddingBottom: Platform.OS === 'android' ? normalize(130) : normalize(100),
  };

  const selectPickerStyle = { iconContainer: styles.filter };

  return (
    <Flex style={scrollViewContentStyle}>
      <Flex flexDirection='row' justifyContent='space-between' style={styles.filterContainer}>
        <Flex flexDirection='row'>
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
        <SelectPicker placeholder={pickerPlaceholder} items={itemsArray} onChangeValue={setFilter} />
      </Flex>
      <Flex flex={1}>
        <FlatList
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={listContainerStyles}
          showsVerticalScrollIndicator={false}
          //data={roomsData}
          data={[]}
          renderItem={renderItem}
        />
      </Flex>
    </Flex>
  );
};

const styles = StyleSheet.create({
  room: { marginBottom: 5 },
  filterContainer: { paddingTop: normalize(16), paddingBottom: normalize(24) },
  filter: { paddingRight: 6 },
  filterIcon: { marginTop: 0 },
  icon: { marginTop: 3 },
});
export default memo(Rooms);
