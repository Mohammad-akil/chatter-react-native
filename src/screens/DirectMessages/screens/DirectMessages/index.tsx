import { memo, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ScreenHeader from '~/components/ScreenHeader';
import IconButton from '~/ui/IconButton';
import Flex from '~/ui/Flex';

import { HeaderSlider } from '../../components/HeaderSlider';
import ConversationsList from '../../components/ConversationsList';

import { useSwipeAnimations } from '../../hooks/useSwipeAnimations';

import { commonStyles } from '~/styles';
import { styles } from './styles';
import { api } from '~/api';
import { useRecoilState } from 'recoil';
import { conversationsState } from './state';
import { CustomShowParams } from '~/ui/Toast/types';
import Toast from 'react-native-toast-message';
export const DirectMessages = memo(() => {
  const [conversationsList, setConversationsList] = useRecoilState(conversationsState);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const swipeAnimations = useSwipeAnimations(conversationsList);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const res = await api.directMessages.getConversations();
        if (!res.success) {
          Toast.show({
            type: 'error',
            text1: res.error,
          } as CustomShowParams);
          return;
        }
        setConversationsList(res.data);
      };
      fetchData();
    }, [setConversationsList]),
  );

  const goToNewMessage = useCallback(() => {
    navigation.navigate('NewMessage');
  }, [navigation.navigate]);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex style={commonStyles.baseScreenPadding}>
        <ScreenHeader titleSize='small' withBackButton title={t('common.messages')}>
          <IconButton type='primary' iconName='add' onPress={goToNewMessage} />
        </ScreenHeader>
      </Flex>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewPadding}>
        <HeaderSlider />
        <ConversationsList
          swipeAnimations={swipeAnimations}
          setConversationsList={setConversationsList}
          conversationsList={conversationsList}
        />
      </ScrollView>
    </SafeAreaView>
  );
});
