import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, ListRenderItem, Platform, TouchableOpacity, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import Typography from '~/ui/Typography';

import { BlurMenuProps } from './types';
import { styles } from './styles';

const BlurMenu: FC<BlurMenuProps> = ({ defaultTab, tabs, handleTabChange }) => {
  const [currentTab, setCurrentTab] = useState<string>(tabs[0].value);
  const blurAmount = Platform.OS === 'ios' ? 0.1 : 32;
  const flatListRef = useRef<FlatList | null>(null);

  const handleTabClick = useCallback(
    (tab: string) => {
      setCurrentTab(tab);
      handleTabChange?.(tab);
    },
    [handleTabChange],
  );

  useEffect(() => {
    if (defaultTab) setCurrentTab(defaultTab);
  }, [defaultTab]);

  const scrollToIndex = tabs.findIndex((tab) => {
    return tab.value === currentTab;
  });

  const renderTabItem: ListRenderItem<{ label: string; value: string }> = useCallback(
    ({ item }) => {
      const isSelected = currentTab === item.value;

      return (
        <TouchableOpacity
          style={[isSelected && styles.selectedTabStyle, styles.tab]}
          onPress={() => handleTabClick(item.value)}
        >
          <Typography type='headline' size='small' color={isSelected ? 'primary400' : 'white'}>
            {item.label}
          </Typography>
        </TouchableOpacity>
      );
    },
    [currentTab, handleTabClick],
  );

  const onScrollToIndexFailed = useCallback(
    (error: any) => {
      flatListRef.current?.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
      setTimeout(() => {
        if (tabs.length !== 0 && flatListRef !== null) {
          flatListRef.current?.scrollToIndex({ index: error.index, animated: false });
        }
      }, 1000);
    },
    [tabs.length],
  );

  return (
    <View style={styles.container}>
      <BlurView blurAmount={blurAmount} overlayColor={'transparent'} style={styles.wrapper}>
        <FlatList
          data={tabs}
          ref={flatListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
          keyExtractor={(item) => item.value}
          renderItem={renderTabItem}
          initialScrollIndex={scrollToIndex}
          onScrollToIndexFailed={onScrollToIndexFailed}
        />
      </BlurView>
    </View>
  );
};

export default memo(BlurMenu);
