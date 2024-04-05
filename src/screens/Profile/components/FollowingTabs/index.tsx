import { type FC, useMemo, useState, useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import type { NavigationState, Route, SceneRendererProps } from 'react-native-tab-view';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useTranslation } from 'react-i18next';

import Following from './tabs/Following';
import Followers from './tabs/Followers';

import { colors } from '~/styles/colors';
import { channelStyles } from './styles';
import { api } from '~/api';
import { User } from '~/entities/User';

type ChannelTabsProps = {
  style?: StyleProp<ViewStyle>;
  view: 'following' | 'followers';
  user: User;
};

const ChannelTabs: FC<ChannelTabsProps> = ({ style, view, user }) => {
  const { t } = useTranslation();
  const [screenIndex, setScreenIndex] = useState(0);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const followers = await api.profile.getFollowersByUserId(user?.id);
      const following = await api.profile.getFollowingByUserId(user?.id);

      setFollowers(followers);
      setFollowing(following);
    }
    fetchData();
  }, [user, view]);

  const screens = useMemo(() => {
    return [
      { key: 'followers', title: t('account.followers') },
      { key: 'following', title: t('account.following') },
    ];
  }, [t]);

  const renderScene = useMemo(() => {
    return SceneMap({
      following: () => <Following following={following} />,
      followers: () => <Followers followers={followers} />,
    });
  }, [followers, following]);

  const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => {
    props.jumpTo(view);
    return (
      <TabBar
        {...props}
        onTabPress={({ route }) => {
          setScreenIndex(screens.findIndex((screen) => screen.key === route.key));
        }}
        navigationState={props.navigationState}
        style={channelStyles.tabBar}
        indicatorStyle={channelStyles.indicator}
        labelStyle={channelStyles.tabLabel}
        activeColor={colors.text.textBrand}
      />
    );
  };

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
