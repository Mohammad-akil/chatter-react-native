import { useCallback, memo } from 'react';
import { Modal, Platform, Pressable, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';

import { AnimatedFlex } from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';

import { normalize } from '~/utils/normalize';
import { colorPalette, colors } from '~/styles/colors';
import { commonStyles } from '~/styles';
import { useTranslation } from 'react-i18next';
import { useAnimation } from './useAnimation';
import { useNavigation } from '@react-navigation/native';

const TabBarButton = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const {
    modalVisible,
    openModal,
    closeModal,
    plusIconStyle,
    animatedButtonContainerStyle,
    leftButtonStyle,
    rightButtonStyle,
  } = useAnimation();

  const dismissModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const goToNewRoom = useCallback(() => {
    closeModal(() => {
      navigate('NewRoom');
    });
  }, [navigate, closeModal]);

  const goToNewConversation = useCallback(() => {
    closeModal(() => {
      navigate('NewConversation');
    });
  }, [navigate, closeModal]);

  const goToNewMessage = useCallback(() => {
    closeModal(() => {
      navigate('NewMessage');
    });
  }, [navigate, closeModal]);

  return (
    <>
      <Modal key='actionButton' visible={modalVisible} animationType='fade' transparent={true}>
        <TouchableWithoutFeedback onPress={dismissModal}>
          <SafeAreaView style={modal.modalBackground}>
            <AnimatedFlex style={animatedButtonContainerStyle} flexDirection='row' justifyContent='center' gap={30}>
              <AnimatedFlex style={leftButtonStyle} gap={6} alignItems='center'>
                <IconButton type='primary' iconName='apps' size='3xl' onPress={goToNewRoom} />
                <Typography style={commonStyles.aeonikRegular} type='label' size='large'>
                  {t('common.room')}
                </Typography>
              </AnimatedFlex>
              <AnimatedFlex gap={6} alignItems='center'>
                <IconButton type='primary' iconName='mic' size='3xl' onPress={goToNewConversation} />
                <Typography style={commonStyles.aeonikRegular} type='label' size='large'>
                  {t('common.conversation')}
                </Typography>
              </AnimatedFlex>

              <AnimatedFlex style={rightButtonStyle} gap={6} alignItems='center'>
                <IconButton type='primary' iconName='chatbubbles-outline' size='3xl' onPress={goToNewMessage} />
                <Typography style={commonStyles.aeonikRegular} type='label' size='large'>
                  {t('common.message').slice(0, -3)}
                </Typography>
              </AnimatedFlex>
            </AnimatedFlex>

            <Pressable style={closeButton.wrapper} onPress={dismissModal}>
              {({ pressed }) => {
                const buttonStyles = [closeButton.button, pressed && closeButton.pressed];
                return (
                  <Animated.View style={buttonStyles}>
                    <Animated.View style={plusIconStyle}>
                      <Icon name={'add-sharp'} color={colors.text.textDefault} size={normalize(18)} />
                    </Animated.View>
                  </Animated.View>
                );
              }}
            </Pressable>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
      <Pressable style={openButton.wrapper} onPress={openModal}>
        {({ pressed }) => {
          const buttonStyles = [openButton.button, pressed && openButton.pressed];
          return (
            <View style={buttonStyles}>
              <Icon name={'add-sharp'} color={colors.text.textDefault} size={normalize(18)} />
            </View>
          );
        }}
      </Pressable>
    </>
  );
};

export default memo(TabBarButton);

const openButton = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    top: normalize(-11),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.buttonPrimaryNormal,
    borderRadius: 360,
    width: normalize(60),
    height: normalize(60),
  },
  pressed: {
    backgroundColor: colors.surface.buttonPrimaryPressed,
  },
});

const closeButton = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    top: Platform.OS === 'ios' ? -1 : 0,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorPalette.error600,
    borderRadius: 360,
    width: normalize(60),
    height: normalize(60),
  },
  pressed: {
    backgroundColor: colorPalette.error700,
  },
});

const modal = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 0 : 9,
    backgroundColor: colors.overlay.modal,
    paddingHorizontal: normalize(20),
  },
});
