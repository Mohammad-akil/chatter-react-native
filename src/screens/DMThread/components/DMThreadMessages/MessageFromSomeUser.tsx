import { memo, useEffect, useMemo, useState, type FC } from 'react';
import { ViewStyle, useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';
import { IMessage } from './types';
import { useResponsiveImageSize } from '../../hooks/useResponsiveImageSize';
import { styles } from './styles';

export const MessageFromSomeUser: FC<IMessage> = memo(
  ({ item, prevMessage, paddingAnotherUser, imageMessageStyle, imageGeneralStyles, gifStyle }) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>();
    const { width, height } = useWindowDimensions();

    useEffect(() => {
      if (item.type === 'image' || item.type === 'imageText') {
        setDimensions({ width: item?.content?.width, height: item?.content?.height });
      }
    }, [item?.content?.height, item?.content?.width, item.type]);

    const responsive = useResponsiveImageSize(dimensions?.width as number, dimensions?.height as number, width, height);

    const imageStyle: ViewStyle = item.type === 'image' || item.type === 'imageText' ? { alignSelf: 'flex-start' } : {};
    const content = useMemo(() => {
      switch (item.type) {
        case 'gif':
          return (
            <Flex flex={1}>
              <FastImage
                source={{
                  uri: item?.content.data?.image?.url,
                }}
                //@ts-ignore
                style={gifStyle}
              />
            </Flex>
          );
        // case 'audio':
        //   return <Typography>Audio message</Typography>;
        case 'imageText':
          return (
            <FastImage
              resizeMode='cover'
              source={{ uri: item.content.image_url }}
              style={[responsive, styles.generalImageStyle]}
            />
          );
        case 'image': {
          return (
            <FastImage
              resizeMode='cover'
              source={{ uri: item.content.image_url }}
              style={[responsive, styles.generalImageStyle]}
            />
          );
        }
        case 'text':
          return <Typography>{item.content.trim()}</Typography>;
      }
    }, [gifStyle, item.content, item.type, responsive]);
    const avatar = item.sender.avatar
      ? item.sender.avatar
      : 'https://content.chattersocial.io/avatars/default_avatar.png';
    return (
      <Flex style={[paddingAnotherUser, imageGeneralStyles]} gap={8} flexDirection='row'>
        {item.sender?.id !== prevMessage?.sender?.id ? (
          <Flex style={styles.userAvatarContainer}>
            <Avatar style={styles.userAvatar} size={40} url={avatar} />
          </Flex>
        ) : (
          <Flex style={styles.emptyContainer}></Flex>
        )}
        <Flex>
          <Flex style={styles.usernameContainer}>
            {item.sender?.id !== prevMessage?.sender?.id && (
              <Typography type='body' style={styles.usernameStyle} size='default'>
                {`${item?.sender?.first_name} ${item?.sender?.last_name}`}
              </Typography>
            )}
          </Flex>
          <Flex style={[styles.messageContainer]}>
            <Flex style={[imageMessageStyle, imageStyle]}>{content}</Flex>
          </Flex>
          {item.type === 'imageText' && (
            <Flex style={[imageGeneralStyles, styles.messageContainer]}>
              <Flex style={[styles.textWithImageContainer, imageMessageStyle, imageStyle]}>
                <Typography>{item.content.text.trim()}</Typography>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    );
  },
);
