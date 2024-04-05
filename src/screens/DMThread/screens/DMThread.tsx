import { SafeAreaView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenHeader from '~/components/ScreenHeader';
import Flex from '~/ui/Flex';

import ChatMenu from '../components/DMThreadMenu';
import DMThreadBody from '../components/DMThreadBody';

import { RootStackParamList } from '~/navigation';
import { commonStyles } from '~/styles';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { api } from '~/api';
import { useStorageUser } from '~/services/mmkv/auth';

export const DMThread = ({ route }: NativeStackScreenProps<RootStackParamList, 'DMThread'>) => {
  const { navigate } = useNavigation();
  const [user] = useStorageUser();
  const [chatPersons, setChatPersons] = useState<any[]>([]);
  useEffect(() => {
    async function fetchUsers() {
      const boxUserNames: string[] = [];
      const response = await api.directMessages.getDmPersons(route.params.chatId);
      console.log(response);
      for (const boxUser of response) {
        if (boxUser.id !== user?.id) {
          boxUserNames.push(boxUser.first_name);
        }
      }
      setChatPersons(boxUserNames);
    }
    fetchUsers();
  }, [user?.id]);
  const names = chatPersons.map((person) => ' ' + person).toString();
  const chatId = route.params.chatId;

  const goBackHandle = useCallback(() => {
    navigate('DirectMessages');
  }, [navigate]);
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex style={commonStyles.baseScreenPadding}>
        <ScreenHeader
          titleSize='small'
          withBackButton
          onBack={goBackHandle}
          title={names}
          titleProps={headerTitleProps}
        >
          <Flex>
            <ChatMenu />
          </Flex>
        </ScreenHeader>
      </Flex>

      <DMThreadBody chatId={chatId} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    maxWidth: '85%',
  },
});

const headerTitleProps = {
  numberOfLines: 1,
  style: styles.headerTitle,
};
