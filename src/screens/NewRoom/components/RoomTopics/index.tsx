import { FC, memo, useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { LinearTransition } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';

import { SearchInput } from '~/components/SearchInput';
import Interest from '~/components/Interest';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import Typography from '~/ui/Typography';

import { CustomShowParams } from '~/ui/Toast/types';
import { useDebounce } from '~/hooks/useDebounce';
import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';

import { availableInterests } from '../../data';
import { roomState } from '../../state';

type RoomTopicsProps = {
  style?: StyleProp<ViewStyle>;
  edit: boolean;
};

export const RoomTopics: FC<RoomTopicsProps> = memo(({ style, edit = false }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [roomData, setRoomData] = useRecoilState(roomState);
  const debouncedSearch = useDebounce(search, 500);

  const filteredInterests = useMemo(() => {
    if (debouncedSearch) {
      return availableInterests.filter(({ text }) => text.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }
    return availableInterests;
  }, [debouncedSearch]);

  useFocusEffect(
    useCallback(() => {
      return () => setSearch('');
    }, []),
  );

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
  }, []);

  const handleSelect = useCallback(
    (name: string) => {
      setRoomData((prev) => {
        const selected = prev.tags.includes(name);
        if (selected) {
          const filtered = prev.tags.filter((item) => item !== name);
          return {
            ...prev,
            tags: filtered,
          };
        } else {
          if (prev.tags.length >= 3) {
            Toast.show({
              type: 'error',
              text1: 'Maximum 3 topics can be selected',
              topOffset: normalize(80),
              autoHide: true,
            } as CustomShowParams);
            return {
              ...prev,
            };
          }
          return {
            ...prev,
            tags: [...prev.tags, name],
          };
        }
      });
    },
    [setRoomData],
  );

  const renderTopics = useCallback<
    ListRenderItem<{
      text: string;
      id: string;
    }>
  >(
    ({ item }) => {
      const isSelected = roomData.tags.includes(item.text);
      return <Interest {...item} key={item.id} isSelected={isSelected} onSelectByName={handleSelect} />;
    },
    [handleSelect, roomData.tags],
  );

  if (!edit) {
    return (
      <AnimatedFlex layout={LinearTransition.duration(300)} style={style} gap={16}>
        <Typography style={commonStyles.aeonikRegular} type='label' size='large'>
          {t('room.topics')}
        </Typography>
        <Typography type='label' size='small'>
          {roomData.tags.join(', ')}
        </Typography>
      </AnimatedFlex>
    );
  }

  return (
    <AnimatedFlex layout={LinearTransition.duration(300)} style={style} gap={16}>
      <Flex gap={4}>
        <Typography style={commonStyles.aeonikRegular} type='label' size='large'>
          {t('room.topics')}
        </Typography>
        <Typography type='body' size='default' color='textSecondary'>
          {t('room.selectThreeTopics')}
        </Typography>
      </Flex>
      <SearchInput value={search} placeholder={t('room.searchTopics')} onChangeText={handleSearch} />
      <FlatList
        horizontal
        keyboardShouldPersistTaps='always'
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topicsList}
        data={filteredInterests}
        renderItem={renderTopics}
      />
    </AnimatedFlex>
  );
});

const styles = StyleSheet.create({
  topicsList: {
    gap: 6,
  },
});
