import { Dispatch, FC, SetStateAction, memo, useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, useWindowDimensions } from 'react-native';
import Popover from 'react-native-popover-view';
import { t } from 'i18next';

import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Flex from '~/ui/Flex';

import { colorPalette, colors } from '~/styles/colors';
import { commonPopover } from '~/styles';
import FastImage from 'react-native-fast-image';
import { normalize } from '~/utils/normalize';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { OwnedChannel } from '~/entities/User';

const popoverAnimation = { duration: 300 };
interface IChannelMenu {
  selectedChannelId: string;
  setSelectedChannelId: Dispatch<SetStateAction<string>>;
  userChannels: OwnedChannel[];
}

const ChannelMenu: FC<IChannelMenu> = ({ userChannels, selectedChannelId, setSelectedChannelId }) => {
  const [menuOpened, setMenuOpened] = useState(false);
  const { navigate } = useNavigation();
  const { height } = useWindowDimensions();

  const popoverStyle = [
    commonPopover.base,
    commonPopover.noBackground,
    { transform: [{ translateX: normalize(10) }, { translateY: 8 }] },
  ];

  const toggleMenu = useCallback(() => {
    setMenuOpened((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpened(false);
  }, []);

  const listButton = useMemo(() => {
    const channelsAvatars: string[] = [];
    userChannels.map((channel) => {
      if (channel.avatar !== null) {
        channelsAvatars.push(channel.avatar);
      }
    });
    const firstAvatar = { uri: channelsAvatars[0] };
    const secondAvatar = { uri: channelsAvatars?.[1] };
    return (
      <TouchableOpacity onPress={toggleMenu} style={[styles.button, menuOpened && styles.activeButton]}>
        <Flex flexDirection='row'>
          <Flex>
            <FastImage style={styles.avatarImage} source={firstAvatar} />
          </Flex>
          {channelsAvatars[1] && (
            <Flex>
              <FastImage style={[styles.avatarImage, styles.secondButton]} source={secondAvatar} />
            </Flex>
          )}
        </Flex>
      </TouchableOpacity>
    );
  }, [toggleMenu, menuOpened, userChannels]);
  const activeButton =
    userChannels.length > 1 ? (
      listButton
    ) : (
      <IconButton iconName='add' type='text' active={menuOpened} onPress={toggleMenu} />
    );
  return (
    <Popover
      isVisible={menuOpened}
      onRequestClose={closeMenu}
      arrowSize={commonPopover.arrow}
      popoverStyle={popoverStyle}
      animationConfig={popoverAnimation}
      backgroundStyle={commonPopover.noBackground}
      offset={2}
      from={activeButton}
    >
      <Flex style={styles.base} flex={1}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: height / 3 }}>
          {userChannels.length > 1 &&
            userChannels.map((channel) => {
              return (
                <TouchableHighlight
                  key={channel.id}
                  underlayColor={colors.surface.surfaceComponent}
                  onPress={() => {
                    setMenuOpened(false);
                    setSelectedChannelId(channel.id);
                  }}
                  style={styles.item}
                >
                  <Flex flexDirection='row' justifyContent='space-between' alignItems='center' gap={8}>
                    <Flex flexDirection='row' gap={4}>
                      {channel?.avatar && <FastImage style={styles.listAvatar} source={{ uri: channel.avatar }} />}
                      <Typography style={styles.channelName} numberOfLines={1}>
                        {channel.name}
                      </Typography>
                    </Flex>
                    {channel.id === selectedChannelId && (
                      <Flex>
                        <Icon name='radio-button-on' color={colorPalette.primary400} />
                      </Flex>
                    )}
                  </Flex>
                </TouchableHighlight>
              );
            })}
        </ScrollView>
        <TouchableHighlight
          underlayColor={colors.surface.surfaceComponent}
          onPress={() => {
            setMenuOpened(false);
            navigate('CreateChannel');
          }}
          style={styles.item}
        >
          <Typography numberOfLines={1}>{t('common.newChannel')}</Typography>
        </TouchableHighlight>
        {userChannels.length < 1 && (
          <TouchableHighlight
            underlayColor={colors.surface.surfaceComponent}
            onPress={() => {
              setMenuOpened(false);
              navigate('CreateChannel');
            }}
            style={styles.item}
          >
            <Typography numberOfLines={1}>{t('common.addAdmin')}</Typography>
          </TouchableHighlight>
        )}
      </Flex>
    </Popover>
  );
};
const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface.buttonDefaultNormal,
    padding: 4,
    alignSelf: 'baseline',
    minWidth: normalize(200),
    maxWidth: normalize(200),
  },
  channelName: { maxWidth: 134 },
  item: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: normalize(12),
  },
  button: {
    borderColor: colorPalette.grey700,
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    backgroundColor: colorPalette.grey700,
  },
  activeButton: {
    backgroundColor: 'transparent',
    borderColor: 'white',
  },
  avatarImage: {
    width: normalize(24),
    height: normalize(24),
    borderRadius: 1.8,
  },
  listAvatar: { width: normalize(18), height: normalize(18), borderRadius: 6 },
  secondButton: { marginLeft: -4, zIndex: 2 },
});

export default memo(ChannelMenu);
