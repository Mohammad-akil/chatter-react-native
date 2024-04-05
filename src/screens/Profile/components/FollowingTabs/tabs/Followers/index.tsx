import { FC, memo } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Typography from '~/ui/Typography';
import { channelStyles } from '../../styles';
import Avatar from '~/ui/Avatar';
import { normalize } from '~/utils/normalize';

type RoomsTabProps = {
  followers: any;
};
type ItemProps = {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  username: string;
};
const UserListItem = ({ user, onPress }: { user: ItemProps; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.listItem}>
    <Avatar style={styles.avatar} size={50} url={user.avatar ?? null} borderRadius='full' />
    <View style={styles.textContainer}>
      <Typography style={styles.name} size='default'>
        {user.first_name} {user.last_name}
      </Typography>
      <Typography style={styles.subtitle} size='default'>
        @{user.username}
      </Typography>
    </View>
  </TouchableOpacity>
);

const Followers: FC<RoomsTabProps> = ({ followers }) => {
  const navigation = useNavigation();
  const renderItem = ({ item }: { item: ItemProps }) => (
    <UserListItem
      user={item}
      onPress={() => {
        navigation.navigate('PreviewProfile', { user_id: item.id });
      }}
    />
  );

  return (
    <View style={channelStyles.tabContent}>
      <FlatList data={followers} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
};

export default memo(Followers);

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
