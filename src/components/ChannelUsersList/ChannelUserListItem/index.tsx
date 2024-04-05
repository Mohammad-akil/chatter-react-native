import { type FC, useMemo, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import ProfileItem from '~/components/ProfileItem';
import type { ButtonProps } from '~/ui/Button/types';
import Button from '~/ui/Button';

import type { UserProps } from './types';
import { TFunction } from 'i18next';

const getRemoveButtonText = (type: 'admin' | 'leader' | undefined, t: TFunction<'en', undefined>) => {
  switch (type) {
    case 'admin':
      return t('common.removeAdmin');
    case 'leader':
      return t('common.removeLeader');
    default:
      return t('common.remove');
  }
};

const ChannelUserListItem: FC<UserProps> = ({ user, type, request, onSendRequest, onRemoveUser, onCancelRequest }) => {
  const { t } = useTranslation();

  const buttonProps: ButtonProps = useMemo(() => {
    if (!request) {
      return { text: t('common.sendRequest'), type: 'secondary', onPress: () => onSendRequest?.(user) };
    }

    switch (request.status) {
      case 'existing':
        return {
          text: getRemoveButtonText(type, t),
          onPress: () => onRemoveUser?.(user),
          type: 'cancel',
        };
      case 'request':
        return {
          text: t('common.cancelRequest'),
          onPress: () => onCancelRequest?.(user),
          type: 'ghost',
        };
    }
  }, [t, request, type, onSendRequest, onRemoveUser, onCancelRequest, user]);

  return (
    <View style={styles.wrapper}>
      <ProfileItem
        size='large'
        avatar={user.avatar}
        firstName={user.first_name}
        lastName={user.last_name}
        userName={user.username}
        isVerified={user.verified}
      />
      <Button {...buttonProps} size='sm' />
    </View>
  );
};

export default memo(ChannelUserListItem);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
});
