import { type FC, memo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';

import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';
import Channel from '../Channel';

import { ChannelCategory as ChannelCategoryType } from '../../Channels/types';

type ChannelCategoryProps = {
  onSelect: (id: string) => void;
  selectedIds: string[];
} & ChannelCategoryType;

const ChannelCategory: FC<ChannelCategoryProps> = ({ name, channels, onSelect, selectedIds }) => {
  return (
    <View>
      <Flex flexDirection='row' alignItems='flex-end' gap={2}>
        <Typography type='body' size='large'>
          {name}
        </Typography>
        <Icon name='chevron-forward-outline' color={colorPalette.white} size={normalize(18)} />
      </Flex>
      <ScrollView contentContainerStyle={styles.channels} horizontal showsHorizontalScrollIndicator={false}>
        {channels.map((channel) => (
          <Channel {...channel} isSelected={selectedIds.includes(channel.id)} onSelect={onSelect} key={channel.id} />
        ))}
      </ScrollView>
    </View>
  );
};

export default memo(ChannelCategory);

const styles = StyleSheet.create({
  channels: {
    marginTop: normalize(12),
    flexDirection: 'row',
    gap: 5,
  },
});
