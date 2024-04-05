import { type FC, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Flex from '~/ui/Flex';
import Button from '~/ui/Button';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';

import { Channel as ChannelType } from '../../Channels/types';
import { normalize } from '~/utils/normalize';

export type ChannelProps = {
  isSelected?: boolean;
  onSelect?: (id: string) => void;
} & ChannelType;

const Channel: FC<ChannelProps> = ({ id, image, title, author, isSelected, onSelect }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.wrapper}>
      <Avatar size={175} borderRadius='minimal' url={image} />
      <Flex alignItems='center'>
        <Typography type='body' size='default'>
          {title}
        </Typography>
        <Typography type='body' size='default'>
          {t('common.by')} {author}
        </Typography>
      </Flex>
      {isSelected ? (
        <Button
          iconName='checkmark-outline'
          iconPosition='right'
          text={t('common.followed')}
          type='ghost'
          size='sm'
          active={true}
          onPress={() => onSelect?.(id)}
          style={styles.button}
        />
      ) : (
        <Button
          iconName='add'
          iconPosition='right'
          size='sm'
          active={false}
          text={t('common.follow')}
          type='ghost'
          onPress={() => onSelect?.(id)}
          style={styles.button}
        />
      )}
    </View>
  );
};

export default memo(Channel);

const styles = StyleSheet.create({
  wrapper: {
    width: normalize(175),
    maxWidth: normalize(175),
    height: normalize(268),
    maxHeight: normalize(268),
    alignItems: 'center',
    gap: normalize(12),
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: normalize(16),
  },
});
