import { type FC, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';
import Avatar from '~/ui/Avatar';
import Button from '~/ui/Button';

import { normalize } from '~/utils/normalize';

export type EditableUsersListProps = {
  title: string;
  users: { id: string; avatar: string }[];
  onEdit?: () => void;
};

const EditableUsersList: FC<EditableUsersListProps> = ({ title, users, onEdit }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.wrapper}>
      <Typography type='label' size='medium' color='textLabel'>
        {title}
      </Typography>
      <Flex flexDirection='row' justifyContent='space-between'>
        <View style={styles.list}>
          {users.map((user) => (
            <Avatar key={user.id} size={52} url={user.avatar} />
          ))}
        </View>
        <Button text={t('common.edit')} type='text' onPress={onEdit} />
      </Flex>
    </View>
  );
};

export default memo(EditableUsersList);

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: normalize(290),
    gap: 5,
  },
});
