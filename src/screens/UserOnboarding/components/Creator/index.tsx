import { type FC, memo, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';

import { normalize } from '~/utils/normalize';
import { Creator as CreatorType } from '../../Creators/types';
import { fonts } from '~/styles/fonts';

type CreatorProps = {
  isSelected?: boolean;
  onSelect?: (id: string) => void;
} & CreatorType;

const Creator: FC<CreatorProps> = ({ id, image, name, followers, username, isSelected, onSelect }) => {
  const touchableStyles = [styles.creator, { backgroundColor: isSelected ? '#535FCB' : '#242424' }];

  const handlePress = useCallback(() => {
    onSelect?.(id);
  }, [id, onSelect]);

  return (
    <TouchableOpacity style={touchableStyles} onPress={handlePress}>
      <Avatar size={72} url={image} />
      <Flex gap={2} alignItems='center'>
        <Typography type='body' size='semibold'>
          {name}
        </Typography>
        <Typography type='body' size='small'>
          {username}
        </Typography>
      </Flex>
      <Text style={styles.followers}>{followers}</Text>
    </TouchableOpacity>
  );
};

export default memo(Creator);

const styles = StyleSheet.create({
  creator: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    alignItems: 'center',
    gap: normalize(12),
    borderRadius: 6,
  },
  followers: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: '400',
    fontFamily: fonts.aeonik.regular,
  },
});
