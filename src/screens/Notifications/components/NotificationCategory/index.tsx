import { type FC, memo } from 'react';
import { View } from 'react-native';

import Notification from '../Notification';
import Typography from '~/ui/Typography';

import type { NotificationCategoryProps } from './types';
import { styles } from './styles';

const NotificationCategory: FC<NotificationCategoryProps> = ({ title, notifications }) => {
  return (
    <View style={styles.wrapper}>
      <Typography type='label' size='large' color='textLabel' style={styles.title}>
        {title}
      </Typography>
      {notifications.map((notification) => (
        //@ts-ignore
        <Notification key={notification.id} {...notification} />
      ))}
    </View>
  );
};

export default memo(NotificationCategory);
