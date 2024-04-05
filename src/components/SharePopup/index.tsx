import { type FC, memo, useCallback, type Dispatch, type SetStateAction } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, Share, Alert } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import BottomSheet from '~/ui/BottomSheet';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';

import { users } from '~/entities/User';
import { CustomToastProps } from '~/ui/Toast/types';
import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';
import { commonStyles } from '~/styles';
import { useRecoilState } from 'recoil';

import { sharePopupState } from '~/state';

type SharePopupProps = {
  /**
   * @param {StyleProp<ViewStyle>} style - open in-app popup
   */
  style?: StyleProp<ViewStyle>;
  /**
   * @param {string} open - open in-app popup
   */
  open: boolean;
  /**
   *  @param {string} title - the title of in-app popup
   */
  title: string;
  /**
   * @param {string} message - title of native popup
   */
  message: string;
  /**
   * @param {string} [url] - url to be share (optional just for now)
   */
  url: string;
  /**
   *  @param {Dispatch<SetStateAction<boolean>>} setOpened - function to manipulate displaying of in-app popup
   */
  setOpened: Dispatch<SetStateAction<boolean>>;
};

const SharePopup: FC<SharePopupProps> = ({ style, open, title, message, url, setOpened }) => {
  const [share, setIsShareOpen] = useRecoilState(sharePopupState);
  const contentStyles = [popup.base, style];

  const { t } = useTranslation();

  const dismissSharePopup = useCallback(() => {
    setIsShareOpen({ open: false, title: '', url: '' });
  }, [setOpened]);

  const setIsOpened = useCallback((value: any) => {
    setIsShareOpen({ open: value, title: '', url: '' });
  }, []);

  const onNativeShare = useCallback(async () => {
    try {
      const result = await Share.share({
        title: message,
        message: message,
        url: url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  }, [message, url]);

  const copyLinkToClipboard = useCallback(() => {
    Clipboard.setString(url);
    Toast.show({
      type: 'normal',
      text1: 'Link copied',
    } as CustomToastProps);
  }, [url]);

  return (
    <BottomSheet open={share.open} style={popup.margin} backdropOpacity={0.5} setOpened={setIsOpened}>
      <Flex gap={16} style={contentStyles}>
        <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
          <Typography type='headline' size='small'>
            {title}
          </Typography>
          <IconButton iconName='close' type='text' onPress={dismissSharePopup} />
        </Flex>
        <Flex gap={20} flexDirection='row' alignItems='center' justifyContent='space-between'>
          <Typography style={popup.roomName} type='label' size='medium'>
            {message}
          </Typography>
          <IconButton iconName='copy' onPress={copyLinkToClipboard} type='ghost' size='xl' />
        </Flex>
        <Flex gap={16}>
          <Typography type='label' size='small'>
            {t('common.community')}
          </Typography>
          <ScrollView
            contentContainerStyle={popup.communityContainer}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            <TouchableOpacity activeOpacity={0.7}>
              <Flex justifyContent='center' alignItems='center' gap={8}>
                <Avatar url={null} size={60} />
                <Typography style={popup.userText} numberOfLines={2} type='body' size='semibold'>
                  {t('common.shareToCommunity')}
                </Typography>
              </Flex>
            </TouchableOpacity>
            {users.map((user) => {
              return (
                <TouchableOpacity key={user.id} activeOpacity={0.7}>
                  <Flex justifyContent='center' alignItems='center' gap={8}>
                    <Avatar url={user.avatar ?? null} size={60} />
                    <Typography type='body' size='semibold'>
                      {user.first_name}
                    </Typography>
                  </Flex>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Flex>
        <Flex gap={8}>
          <TouchableOpacity style={popup.optionButton}>
            <Icon name='mail' size={normalize(20)} color={colors.text.textDefault} />
            <Typography type='body' size='medium'>
              {t('common.sendViaDM')}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={popup.optionButton} onPress={onNativeShare}>
            <Icon name='ellipsis-horizontal' size={normalize(20)} color={colors.text.textDefault} />
            <Typography type='body' size='medium'>
              {t('common.shareOptions')}
            </Typography>
          </TouchableOpacity>
        </Flex>
        <Button type='ghost' size='md' text='Cancel' onPress={dismissSharePopup} />
      </Flex>
    </BottomSheet>
  );
};

export default memo(SharePopup);

const popup = StyleSheet.create({
  base: {
    padding: normalize(16),
  },
  roomName: {
    ...commonStyles.flexFull,
    ...commonStyles.aeonikRegular,
  },
  communityContainer: {
    gap: normalize(16),
  },
  optionButton: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  userText: {
    textAlign: 'center',
    maxWidth: 80,
  },
  margin: {
    marginHorizontal: normalize(16),
  },
});
