import { memo, useCallback, useMemo, useState } from 'react';
import {
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
  FlatList,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Popover from 'react-native-popover-view';
import { useTranslation } from 'react-i18next';

import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';

import { normalize } from '~/utils/normalize';
import { commonPopover } from '~/styles';
import { colors } from '~/styles/colors';
import { api } from '~/api';
import { useRecoilValue } from 'recoil';
import { state } from '../../state/roomState';

const reactionItems = [
  {
    id: 1,
    emoji: '❤️',
  },
  {
    id: 2,
    emoji: '😁',
  },
  {
    id: 3,
    emoji: '😂',
  },
  {
    id: 4,
    emoji: '🤩',
  },
  {
    id: 5,
    emoji: '😎',
  },
  {
    id: 6,
    emoji: '🤓',
  },
  {
    id: 7,
    emoji: '🥳',
  },
  {
    id: 8,
    emoji: '😡',
  },
  {
    id: 9,
    emoji: '👍',
  },
  {
    id: 10,
    emoji: '🤌',
  },
  {
    id: 11,
    emoji: '🗿',
  },
  {
    id: 12,
    emoji: '💀',
  },
  {
    id: 13,
    emoji: '👀',
  },
  {
    id: 14,
    emoji: '✅',
  },
  {
    id: 15,
    emoji: '❌',
  },
];

const popoverAnimation = { duration: 300 };

const PICKER_HORIZONTAL_PADDING = 16;
const NUM_OF_COLUMNS = 5;

const ReactionButton = () => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const roomDetails = useRecoilValue(state.roomDetailsState);

  const popoverStyles: StyleProp<ViewStyle> = useMemo(() => {
    return [commonPopover.base, commonPopover.noBackground, { width: width, paddingHorizontal: 10 }];
  }, [width]);

  const togglePicker = useCallback(() => {
    setOpenEmojiPicker((prev) => !prev);
  }, []);

  const closePicker = useCallback(() => {
    setOpenEmojiPicker(false);
  }, []);

  const renderEmojiButton: ListRenderItem<{
    id: number;
    emoji: string;
  }> = useCallback(
    ({ item }) => {
      const react = async () => {
        if (roomDetails?.id) {
          api.room.sendReaction(roomDetails?.id, item.emoji);
          closePicker();
        }
      };

      return <Button type='text' size='xl' text={item.emoji} onPress={react} />;
    },
    [roomDetails, closePicker],
  );

  return (
    <Popover
      isVisible={openEmojiPicker}
      onRequestClose={closePicker}
      arrowSize={commonPopover.arrow}
      popoverStyle={popoverStyles}
      animationConfig={popoverAnimation}
      backgroundStyle={commonPopover.noBackground}
      offset={normalize(21)}
      from={
        <IconButton
          type='secondary'
          active={openEmojiPicker}
          size='3xl'
          iconName='happy-outline'
          onPress={togglePicker}
        />
      }
    >
      <Flex gap={6} style={picker.base}>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Typography type='headline' size='small'>
            {t('room.react')}
          </Typography>
          <IconButton style={picker.closeButton} type='text' iconName='close-outline' size='lg' onPress={closePicker} />
        </Flex>
        <FlatList
          data={reactionItems}
          horizontal={false}
          scrollEnabled={false}
          columnWrapperStyle={picker.columnWrapper}
          numColumns={NUM_OF_COLUMNS}
          renderItem={renderEmojiButton}
        />
      </Flex>
    </Popover>
  );
};

export default memo(ReactionButton);

const picker = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.surfaceComponent,
    paddingHorizontal: normalize(PICKER_HORIZONTAL_PADDING),
    paddingVertical: normalize(20),
    borderRadius: 6,
    flex: 1,
  },
  closeButton: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  columnWrapper: {
    gap: normalize(20),
    justifyContent: 'space-between',
  },
});
