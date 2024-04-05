import { memo, useEffect, useMemo, useState, type FC } from 'react';
import { ViewStyle, useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';
import { IMessage } from './types';
import { useResponsiveImageSize } from '../../hooks/useResponsiveImageSize';
import { styles } from './styles';

export const MyMessage: FC<IMessage> = memo(
  ({ item, paddingAnotherUser, imageMessageStyle, imageGeneralStyles, gifStyle }) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>();
    const { width, height } = useWindowDimensions();

    useEffect(() => {
      if (item.type === 'image' || item.type === 'imageText') {
        setDimensions({ width: item?.content?.width, height: item?.content?.height });
      }
    }, [item?.content?.height, item?.content?.width, item.type]);

    const responsive = useResponsiveImageSize(dimensions?.width as number, dimensions?.height as number, width, height);

    const imageStyle: ViewStyle = item.type === 'image' || item.type === 'imageText' ? { alignSelf: 'flex-end' } : {};
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
        case 'imageText' || 'image':
          return (
            <FastImage
              resizeMode='cover'
              source={{ uri: item.content.image_url }}
              style={[styles.generalImageStyle, responsive]}
            />
          );
        case 'image': {
          return (
            <FastImage
              resizeMode='cover'
              source={{ uri: item.content.image_url }}
              style={[styles.generalImageStyle, responsive]}
            />
          );
        }
        case 'text':
          return <Typography>{item.content.trim()}</Typography>;
      }
    }, [gifStyle, item.content, item.type, responsive]);
    return (
      <Flex style={paddingAnotherUser} gap={8} justifyContent='flex-end' alignSelf='flex-end' flexDirection='row'>
        <Flex>
          <Flex style={[imageGeneralStyles, styles.messageContainer]}>
            <Flex style={[imageMessageStyle, styles.userMessage, imageStyle]}>{content}</Flex>
          </Flex>
          {item.type === 'imageText' && (
            <Flex style={[imageGeneralStyles, styles.messageContainer]}>
              <Flex style={[styles.textWithImageContainer, imageMessageStyle, styles.userMessage, imageStyle]}>
                <Typography>{item.content.text.trim()}</Typography>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    );
  },
);
