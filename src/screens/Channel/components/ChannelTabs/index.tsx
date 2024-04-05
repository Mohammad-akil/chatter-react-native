import { type FC, useCallback, useMemo, useState } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import type { NavigationState, Route, SceneRendererProps } from 'react-native-tab-view';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';

import RoomsTab from './tabs/Rooms';
import MomentsTab from './tabs/Moments';
import AudienceTab from './tabs/Audience';

import { colors } from '~/styles/colors';
import { channelStyles } from './styles';

type ChannelTabsProps = {
  style?: StyleProp<ViewStyle>;
  view: 'preview' | 'owner';
};

const ChannelTabs: FC<ChannelTabsProps> = ({ style, view }) => {
  const { t } = useTranslation();
  const [screenIndex, setScreenIndex] = useState(0);

  const screens = useMemo(() => {
    return [
      { key: 'rooms', title: t('channel.rooms') },
      { key: 'moments', title: t('channel.moments') },
      { key: 'audience', title: t('channel.audience') },
    ];
  }, [t]);

  const renderScene = useMemo(() => {
    return SceneMap({
      rooms: () => <RoomsTab view={view} />,
      moments: () => <MomentsTab view={view} />,
      audience: () => <AudienceTab view={view} />,
    });
  }, [view]);

  const renderTabBar = useCallback((props: SceneRendererProps & { navigationState: NavigationState<Route> }) => {
    return (
      <TabBar
        {...props}
        style={channelStyles.tabBar}
        indicatorStyle={channelStyles.indicator}
        labelStyle={channelStyles.tabLabel}
        activeColor={colors.text.textBrand}
      />
    );
  }, []);

  return (
    <TabView
      navigationState={{ routes: screens, index: screenIndex }}
      onIndexChange={setScreenIndex}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      style={style}
    />
  );
};

export default ChannelTabs;
