import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { t } from 'i18next';

import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Flex from '~/ui/Flex';

import DMThreadTextArea from '../DMThreadTextArea';
import ImagePreview from '../ImagePreview';

import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';
import { styles } from './styles';
import useGifMessageLogic from '../../hooks/useGifMessageLogic';
import useDirectMessageSender from '../../hooks/useDirectMessageSender';
import { useImagePick } from '../../hooks/useImagePick';
import { Image } from '~/entities/DirectMessages';

interface IDMThreadFooter {
  chatId: string;
}

export const DMThreadFooter: FC<IDMThreadFooter> = memo(({ chatId }) => {
  const [textInputValue, setTextInputValue] = useState<string>('');
  const [imageUriValue, setImageUriValue] = useState<string | undefined>('');
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [image, setImage] = useState<Image>();

  const isDisabled = useMemo(() => !!textInputValue.trim() || !!imageUriValue, [imageUriValue, textInputValue]);

  const handleDeleteImage = useCallback(() => {
    setImageUriValue('');
  }, [setImageUriValue]);

  const { handlePickGif } = useGifMessageLogic(chatId);

  const { sendMessage } = useDirectMessageSender(textInputValue, imageUriValue);

  const { handlePickImage } = useImagePick(setImageUriValue, setImage);

  const send = useCallback(() => {
    sendMessage(chatId, image);
    setTextInputValue('');
    setImageUriValue('');
  }, [chatId, image, sendMessage]);

  useEffect(() => {
    const keyboardIsShownListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardActive(true);
    });
    const keyboardIsHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardActive(false);
    });

    return () => {
      keyboardIsShownListener.remove();
      keyboardIsHideListener.remove();
    };
  }, []);

  const androidPadding = Platform.OS === 'android' && isKeyboardActive ? { marginBottom: normalize(45) } : {};
  const sendButtonStyle = !textInputValue ? { alignItems: 'center' } : { alignItems: 'flex-end' };

  return (
    <Flex style={[styles.generalContainer, androidPadding]} gap={8}>
      {imageUriValue && <ImagePreview uri={imageUriValue} handleDelete={handleDeleteImage} />}
      <Flex flexDirection='row' gap={6}>
        <Flex flexDirection='row' flex={1} gap={10} alignItems='center' style={sendButtonStyle as ViewStyle}>
          <Flex
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            flex={1}
            style={styles.chatFooter}
          >
            <DMThreadTextArea
              setIsInputFocused={setIsInputFocused}
              textInputValue={textInputValue}
              setTextInputValue={setTextInputValue}
            />
            {!textInputValue && (
              <Flex gap={6} flexDirection='row' alignItems='center' style={styles.imagesNavContainer}>
                <TouchableOpacity onPress={handlePickImage}>
                  <Icon color={colorPalette.grey100} size={normalize(20)} name='image-outline' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.gifButton} onPress={handlePickGif}>
                  <Typography type='body' size='semibold' style={styles.gifButtonText} color='black'>
                    {t('chat.gif')}
                  </Typography>
                </TouchableOpacity>
              </Flex>
            )}
          </Flex>
          <Flex>
            <IconButton
              borderRadius='minimal'
              iconName='send'
              size='lg'
              type='send'
              sizeOfIcon={20}
              disabled={!isDisabled}
              onPress={send}
            />
          </Flex>
        </Flex>
        {!isInputFocused && <IconButton iconName='mic-outline' type='room-control' size='3xl' />}
      </Flex>
    </Flex>
  );
});
