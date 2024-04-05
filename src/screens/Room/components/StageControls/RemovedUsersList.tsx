import { type FC, memo, useCallback } from 'react';
import { type StyleProp, type ViewStyle, ListRenderItem } from 'react-native';
import { LinearTransition } from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { api } from '~/api';
import { RemovedUser } from '~/entities/Room';

import ProfileItem from '~/components/ProfileItem';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import Typography from '~/ui/Typography';
import Button from '~/ui/Button';

import { ROOM_REMOVED_USERS_QUERY_KEY } from '../../queries/useRemovedUsers';
import { useRecoilValue } from 'recoil';
import { state } from '../../state/roomState';

type RemovedUsersListProps = {
  style?: StyleProp<ViewStyle>;
  removedUsers: RemovedUser[];
};

const RemovedUsersList: FC<RemovedUsersListProps> = ({ removedUsers }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const roomDetails = useRecoilValue(state.roomDetailsState);

  const renderRemovedUsers = useCallback<ListRenderItem<RemovedUser>>(
    ({ item }) => {
      const allowBackIn = async () => {
        if (roomDetails?.id) {
          await api.room.reAllowRemovedUser(item.id);
          queryClient.invalidateQueries({ queryKey: [ROOM_REMOVED_USERS_QUERY_KEY] });
        }
      };

      return (
        <Flex gap={6}>
          <Flex flexDirection='row' justifyContent='space-between'>
            <ProfileItem
              size='small'
              avatar={item.user.avatar ?? null}
              userName={item.user.username}
              firstName={item.user.first_name}
            />
            <Button type='secondary' size='sm' text={t('room.allowBackIn')} onPress={allowBackIn} />
          </Flex>
          <Typography type='body' size='small' color='error400'>
            {t('room.removedBy')} {item.removed_by.first_name} @{item.removed_by.username}
          </Typography>
        </Flex>
      );
    },
    [roomDetails, queryClient, t],
  );

  return (
    <AnimatedFlex gap={8} layout={LinearTransition.duration(300)}>
      <Typography type='label' size='medium' color='textLabel'>
        {t('room.removedUsers')}
      </Typography>
      <FlatList
        scrollEnabled={false}
        data={removedUsers}
        contentContainerStyle={{ gap: 8 }}
        contentInset={{ bottom: 250 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderRemovedUsers}
      />
    </AnimatedFlex>
  );
};

export default memo(RemovedUsersList);
