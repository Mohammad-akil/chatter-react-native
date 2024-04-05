import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Animated, FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity } from 'react-native';

import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { api } from '~/api';
import { User } from '~/entities/User';
import VerifiedIcon from '~/ui/VerifiedIcon';

interface IHeaderSlider {
  item: User;
}

const HeaderSliderItem: FC<IHeaderSlider> = memo(({ item }) => {
  return (
    <TouchableOpacity key={item.id}>
      <Animated.View style={styles.listItem}>
        <Flex justifyContent='center' gap={8}>
          <Avatar url={item.avatar} size={60} badge='12m' />
          <Flex flexDirection='row' alignItems='center' justifyContent='center' style={styles.nameContainer} gap={4}>
            <VerifiedIcon />
            <Flex style={styles.nameStyle}>
              <Typography ellipsizeMode='tail' numberOfLines={1}>
                {item.first_name}
              </Typography>
            </Flex>
          </Flex>
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
    gap: normalize(36),
  },
  listItem: {
    maxWidth: normalize(60),
  },
  nameStyle: { maxWidth: normalize(70) },
  nameContainer: { left: -normalize(10) },
});
