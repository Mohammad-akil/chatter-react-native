import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Animated, FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { api } from '~/api';
import { User } from '~/entities/User';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';

interface IHeaderSlider {
  item: User;
}

const HeaderSliderItem: FC<IHeaderSlider> = memo(({ item }) => {
  const { navigate } = useNavigation();
  const goToChat = async () => {
    const res = await api.directMessages.createConversation([item.id]);
    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: res.error,
      } as CustomShowParams);
      return;
    }
    navigate('DMThread', {
      chatId: res.data.id,
      boxUsers: [item.first_name],
    });
  };
  return (
    <TouchableOpacity key={item.id} onPress={goToChat}>
      <Animated.View style={styles.listItem}>
        <Flex justifyContent='center' alignItems='center' gap={8}>
          <Avatar url={item.avatar} size={75} />
          <Typography numberOfLines={1}>{item.first_name}</Typography>
        </Flex>
      </Animated.View>
    </TouchableOpacity>
  );
});

export const HeaderSlider = memo(() => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.profile.getAllProfiles();
        return res;
      } catch (e) {
        console.log(e);
      }
    };
    getUsers().then((data: any) => {
      setUsers(data.data);
    });
  }, []);
  const headerSliderItem = useCallback(({ item }: ListRenderItemInfo<User>) => {
    return <HeaderSliderItem item={item} />;
  }, []);

  return (
    <FlatList
      data={users}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={headerSliderItem}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(16),
    paddingBottom: normalize(32),
    gap: normalize(24),
  },
  listItem: {
    maxWidth: normalize(75),
  },
});
