import { type FC, memo, useCallback, useMemo, useState } from 'react';
import { FlatList, type ListRenderItem, StyleSheet } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';

import { SearchInput } from '~/components/SearchInput';
import Flex from '~/ui/Flex';
import UserItem from './ChannelUserListItem';
import type { RequestedUser } from './ChannelUserListItem/types';

import { filterListByStringField } from '~/utils';
import { normalize } from '~/utils/normalize';

import type { ChannelUsersListProps } from './types';
import { User } from '~/entities/User';

const ChannelUsersList: FC<ChannelUsersListProps> = ({
  users = [],
  defaultSearch = '',
  type,
  name,
  style,
  onSendRequest,
  onCancelRequest,
  onRemoveUser,
}) => {
  const { setValue } = useFormContext();
  const [search, setSearch] = useState(defaultSearch);

  const filteredUsers = useMemo(() => {
    return filterListByStringField(users, ['first_name', 'last_name', 'username'], search);
  }, [search, users]);

  const usersRequests: RequestedUser[] = useWatch({ name });
  const setUserRequests = useCallback((requests: RequestedUser[]) => setValue(name, requests), [setValue, name]);

  const handleSendRequest = useCallback(
    (user: User) => {
      onSendRequest?.(user.id);
      setUserRequests([...usersRequests, { id: user.id, status: 'request' }]);
    },
    [onSendRequest, usersRequests, setUserRequests],
  );

  const handleCancelRequest = useCallback(
    (user: User) => {
      onCancelRequest?.(user.id);
      setUserRequests(usersRequests.filter(({ id }) => id !== user.id));
    },
    [onCancelRequest, usersRequests, setUserRequests],
  );

  const handleRemoveUser = useCallback(
    (user: User) => {
      onRemoveUser?.(user.id);
      setUserRequests(usersRequests.filter(({ id }) => id !== user.id));
    },
    [onRemoveUser, usersRequests, setUserRequests],
  );

  const renderItem: ListRenderItem<User> = useCallback(
    ({ item }) => (
      <UserItem
        user={item}
        type={type}
        request={usersRequests.find((request) => request.id === item.id)}
        onSendRequest={handleSendRequest}
        onCancelRequest={handleCancelRequest}
        onRemoveUser={handleRemoveUser}
      />
    ),
    [type, usersRequests, handleSendRequest, handleCancelRequest, handleRemoveUser],
  );

  return (
    <Flex style={style} flex={1} gap={40}>
      <SearchInput onChangeText={setSearch} />
      <FlatList data={filteredUsers} key='id' contentContainerStyle={styles.list} renderItem={renderItem} />
    </Flex>
  );
};

export default memo(ChannelUsersList);

export const styles = StyleSheet.create({
  list: {
    gap: normalize(24),
  },
});
