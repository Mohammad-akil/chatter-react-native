import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';

import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';
import { chatOpenedState } from '../../state/chatState';

export const ChatHeader = memo(() => {
  const { t } = useTranslation();

  const setChatOpened = useSetRecoilState(chatOpenedState);
  const activeSpeakers = useRecoilValue(state.activeSpeakersState);

  const { goBack } = useNavigation();

  const onGoBack = useCallback(() => {
    goBack();
    setChatOpened(false);
  }, [goBack, setChatOpened]);

  return (
    <Flex style={headerStyles.base} flexDirection='row' alignItems='center' justifyContent='space-between'>
      <Flex gap={4} flexDirection='row' alignItems='center'>
        <Icon onPress={onGoBack} name='chevron-back-outline' color={colors.text.textLabel} size={normalize(24)} />
        <Typography type='headline' size='small'>
          {t('room.chat')}
        </Typography>
      </Flex>
      <View style={{ height: 40 }}>
        {activeSpeakers[0] && (
          <Flex flexDirection='row' alignItems='center' gap={4}>
            <Avatar url={activeSpeakers[0].user_avatar ?? null} />
            <Typography type='label' size='small'>
              {activeSpeakers[0].user_first_name} {t('room.isSpeaking')}
            </Typography>
          </Flex>
        )}
      </View>
    </Flex>
  );
});

const headerStyles = StyleSheet.create({
  base: {
    paddingTop: normalize(20),
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(15),
  },
});
