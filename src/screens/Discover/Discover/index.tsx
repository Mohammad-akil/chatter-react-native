import { memo, useMemo, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Spotlight from '../components/Spotlight';
import Flex from '~/ui/Flex';
import { commonStyles } from '~/styles';
import Moments from '../components/Moments';
import Rooms from '../components/Rooms';
import Channels from '../components/Channels';
import { colorPalette } from '~/styles/colors';
import CommonHeader from '../components/CommonHeader';
import People from '../components/People';
import { BlurMenuItem } from '~/components/BlurMenu/types';

const Discover = () => {
  const { t } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();

  const menuItems: BlurMenuItem[] = useMemo(
    () => [
      {
        label: t('discover.spotlight'),
        value: 'spotlight',
      },
      {
        label: t('discover.moments'),
        value: 'moments',
      },
      {
        label: t('discover.rooms'),
        value: 'rooms',
      },
      {
        label: t('discover.channels'),
        value: 'channels',
      },
    ],
    [t],
  );

  const [tab, setTab] = useState(menuItems[0].value);

  const content = useMemo(() => {
    switch (tab) {
      case 'spotlight':
        return <Spotlight />;
      case 'moments':
        return <Moments />;
      case 'rooms':
        return <Rooms />;
      case 'channels':
        return <Channels />;
      case 'people':
        return <People />;
    }
  }, [tab]);
  const contentStyle = useMemo(() => {
    return [commonStyles.fullHeight, { paddingBottom: bottom, backgroundColor: colorPalette.grey900 }];
  }, [bottom]);
  const headerStyle = useMemo(() => {
    return { top: top, zIndex: 1 };
  }, [top]);

  const contentContainer: StyleProp<ViewStyle> = useMemo(() => {
    return tab === 'spotlight' ? { position: 'absolute', top: 0 } : null;
  }, [tab]);
  return (
    <View style={contentStyle}>
      <Flex style={headerStyle}>
        <CommonHeader tab={tab} tabs={menuItems} setTab={setTab} />
      </Flex>
      <View style={contentContainer}>{content}</View>
    </View>
  );
};
export default memo(Discover);
