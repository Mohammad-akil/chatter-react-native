import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import ChannelDisplayCard from '~/components/ChannelDisplayCard';
import { Channel } from '~/entities/Channel';
import { recentlyViewData } from '~/screens/Profile/data';
import SelectPicker from '~/components/SelectPicker';
import { colorPalette } from '~/styles/colors';

const Channels = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [sort, setSort] = useState('');

  const sortPlaceholder = { label: 'Sort', value: 'Sort' };
  const itemsSortArray = [{ label: 'sorted', value: 'sorted' }];
  const filterPlaceholder = { label: 'All topics', value: 'All topics' };
  const itemsFilterArray = [{ label: 'filtered', value: 'filtered' }];

  const scrollViewContentStyle = useMemo(() => {
    return [commonStyles.fullHeight, { paddingBottom: bottom, paddingTop: top }, commonStyles.baseScreenPadding];
  }, [top, bottom]);
  const renderItem: ListRenderItem<Channel> = useCallback(({ item }) => {
    return <ChannelDisplayCard style={styles.channel} title={item.name} avatar={item.avatar} />;
  }, []);
  const listContainerStyles: StyleProp<ViewStyle> = {
    paddingBottom: Platform.OS === 'android' ? normalize(130) : normalize(100),
    gap: 4,
    alignItems: 'center',
  };

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
          numColumns={2}
          data={recentlyViewData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={listContainerStyles}
          keyExtractor={(item) => String(item.id)}
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
  channel: { marginRight: 4, marginBottom: normalize(16) },
});

export default memo(Channels);
