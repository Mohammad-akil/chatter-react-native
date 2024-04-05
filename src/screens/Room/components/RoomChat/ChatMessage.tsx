import { StyleSheet, useWindowDimensions } from 'react-native';
import { ListRenderItem } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';

import { GifContent, RoomChatMessage } from '~/entities/Message';

import { useResponsiveImageSize } from '~/screens/DMThread/hooks/useResponsiveImageSize';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';
import { commonStyles } from '~/styles';

const GifMessage = ({ item }: { item: RoomChatMessage }) => {
  const { width, height } = useWindowDimensions();
  const gif = item.content as GifContent;

  const responsiveGif = useResponsiveImageSize(Number(gif.image.width), Number(gif.image.height), width, height);

  return (
    <Flex style={styles.base} alignItems='flex-start' flexDirection='row' gap={4}>
      <Avatar size={40} url={item.user.avatar} />
      <Flex gap={4}>
        <Typography
          type='body'
          size='semibold'
          color='textLabel'
        >{`${item.user.first_name} ${item.user.last_name}`}</Typography>
        <FastImage
          source={{
            uri: gif.image.url ?? undefined,
          }}
          style={[responsiveGif, styles.gifStyle]}
        />
      </Flex>
    </Flex>
  );
};

export const ChatMessage: ListRenderItem<RoomChatMessage> = ({ item }) => {
  switch (item.type) {
    case 'text':
      return (
        <Flex style={styles.base} alignItems='flex-start' flexDirection='row' gap={4}>
          <Avatar size={40} url={item.user.avatar} />
          <Flex style={commonStyles.flexFull} gap={4}>
            <Typography
              type='body'
              size='semibold'
              color='textLabel'
            >{`${item.user.first_name} ${item.user.last_name}`}</Typography>
            <Typography>{item.content.text}</Typography>
          </Flex>
        </Flex>
      );

    case 'gif':
      return <GifMessage item={item} />;

    case 'contribution':
      return (
        <Flex style={styles.base}>
          <Flex gap={4} style={styles.contributionStyle}>
            <Flex flexDirection='row' justifyContent='space-between' gap={8}>
              <Flex flexDirection='row' gap={4}>
                <Avatar size={48} url={item.user.avatar} />
                <Flex gap={4}>
                  <Typography
                    type='body'
                    size='semibold'
                    color='textLabel'
                  >{`${item.user.first_name} ${item.user.last_name}`}</Typography>
                  <Typography
                    type='label'
                    size='medium'
                    color='textDefault'
                  >{`$${Math.round(item.content.amount)}`}</Typography>
                </Flex>
              </Flex>
              <Typography style={styles.contributionChatterLogo}>Chatter</Typography>
            </Flex>
            <Typography type='body' size='default' color='textDefault'>
              {item.content.text}
            </Typography>
          </Flex>
        </Flex>
      );
  }
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: normalize(12),
  },
  gifStyle: {
    borderRadius: 10,
  },
  contributionStyle: {
    paddingHorizontal: normalize(12),
    paddingVertical: 6,
    backgroundColor: colorPalette.primary800,
    borderRadius: 20,
    borderWidth: 0.6,
    borderColor: '#E6E0D4',
  },

  contributionChatterLogo: {
    paddingTop: 8,
  },
});
