import dayjs from 'dayjs';
import { BlurView } from '@react-native-community/blur';
import { Platform, TouchableOpacity, View } from 'react-native';
import { FC, memo, useCallback, useState } from 'react';

import Flex from '~/ui/Flex';
import Avatar from '~/ui/Avatar';
import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import { SpotLightBlockProps } from './types';
import { addToCalendar } from '~/utils/addToCalendar';
import { styles } from './styles';
import { normalize } from '~/utils/normalize';

const SpotlightBlock: FC<SpotLightBlockProps> = ({ name, description, date, author, added, style }) => {
  const handleShare = useCallback(() => ({}), []);
  const [isAdded, setIsAdded] = useState(added);
  const calendarIcon = isAdded ? 'checkmark' : 'calendar-outline';
  const handleAddToCalendar = useCallback(() => {
    addToCalendar(name, date, setIsAdded);
  }, [date, name]);
  const handleOpenOptions = useCallback(() => ({}), []);
  const handleClick = useCallback(() => ({}), []);

  const dayOfWeek = dayjs(date).format('dddd');
  const formattedDate = dayjs(date).format('MMM D h A');
  const blurAmount = Platform.OS === 'ios' ? 0.1 : 32;
  return (
    <View style={style}>
      <View style={styles.container}>
        <BlurView blurAmount={blurAmount} overlayColor={'transparent'}>
          <TouchableOpacity style={styles.wrapper} onPress={handleClick} activeOpacity={0.9}>
            <Flex gap={4}>
              <Flex flexDirection='row' gap={4} justifyContent='space-between' alignItems='center'>
                <Flex flexDirection='row' gap={4} alignItems='center'>
                  <Avatar url={author.avatar} size={normalize(24)} borderRadius={'minimal'} />
                  <Typography type='label' size='small'>
                    {author.name}
                  </Typography>
                </Flex>
                <IconButton onPress={handleOpenOptions} iconName='ellipsis-horizontal' transparent />
              </Flex>
              <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
                <Typography type='headline' size='small' style={styles.name}>
                  {name}
                </Typography>
                <Flex justifyContent='flex-end' style={styles.date}>
                  <Typography type='headline' size='default' color='textSecondary' textAlign='right'>
                    {dayOfWeek}
                  </Typography>
                  <Typography type='headline' size='default' color='textSecondary' numberOfLines={1}>
                    {formattedDate}
                  </Typography>
                </Flex>
              </Flex>
              <Flex justifyContent='space-between' flexDirection='row'>
                <Typography type='body' size='default' color='textSecondary' style={styles.description}>
                  {description}
                </Typography>
                <Flex gap={6} flexDirection='row' alignItems='center' style={styles.actions}>
                  <IconButton onPress={handleShare} iconName='share-outline' />
                  <IconButton disabled={isAdded} onPress={handleAddToCalendar} iconName={calendarIcon} type='primary' />
                </Flex>
              </Flex>
            </Flex>
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
};

export default memo(SpotlightBlock);
