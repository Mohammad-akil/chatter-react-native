import { commonStyles } from '~/styles';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import FollowingTabs from '../FollowingTabs';

import { FC } from 'react';

const FollowingList: FC<any> = (navigation) => {
  const { view, user } = navigation.route.params;
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton={true} title={`@${user?.username}`} />
      <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <Flex gap={2}></Flex>
      </Flex>
      <FollowingTabs key={view} view={view} user={user} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    paddingVertical: normalize(10),
  },
  title: {
    paddingTop: 16,
    paddingBottom: 8,
    maxWidth: '100%',
    fontSize: 24,
    color: '#00CED1',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.2,
    borderColor: '#2C2C2EFF',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
});

export default FollowingList;
