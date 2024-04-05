import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, FlatList, ListRenderItem } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import ScreenHeader from '~/components/ScreenHeader';
import { TextInput } from '~/ui/TextInput';
import Typography from '~/ui/Typography';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';

import { commonStyles } from '~/styles';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';
import IconButton from '~/ui/IconButton';
import { User } from '~/entities/User';
import { api } from '~/api';
import Toast from 'react-native-toast-message';
import { CustomShowParams } from '~/ui/Toast/types';

export const NewMessages = () => {
  const { t } = useTranslation();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [showButton, setShowButton] = useState(false);
  const [search, setSearch] = useState('');
  const { navigate } = useNavigation();
  const [users, setUsers] = useState<User[]>([]);

  const getAllUsers = useCallback(async () => {
    try {
      const res = await api.profile.getAllProfiles();
      return res;
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    const users = getAllUsers();
    users.then((data: any) => {
      setUsers(data.data);
    });
  }, [getAllUsers]);

  const handleCheckboxChange = useCallback((id: string, value: boolean) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [id]: value,
    }));
  }, []);

  useEffect(() => {
    const hasTrueValue = Object.values(checkedItems).some((value) => value === true);
    setShowButton(hasTrueValue);
  }, [checkedItems]);

  const selectedPeople = users.filter((person) => checkedItems[person.id]);
  const handleSearch = useCallback((text: string) => {
    setSearch(text);
  }, []);

  const goToChat = useCallback(async () => {
    const selectedIds = selectedPeople.map((person) => person.id);
    const res = await api.directMessages.createConversation(selectedIds);
    if (!res.success) {
      Toast.show({
        type: 'error',
        text1: res.error,
      } as CustomShowParams);
      return;
    }
    const boxUsers: string[] = [];
    res.data.users.map((user) => {
      return boxUsers.push(user.first_name);
    });
    navigate('DMThread', {
      chatId: res.data.id,
      boxUsers: boxUsers,
    });
  }, [navigate, selectedPeople]);

  const renderPersons: ListRenderItem<User> = useCallback(
    (person) => {
      return (
        <TouchableOpacity
          key={person.item.id}
          onPress={() => handleCheckboxChange(person.item.id, !checkedItems[person.item.id])}
        >
          <Flex
            flexDirection='row'
            gap={4}
            alignItems='center'
            justifyContent='space-between'
            style={styles.conversationContainer}
          >
            <Flex flexDirection='row' alignItems='center' gap={4}>
              <Avatar url={person.item.avatar} size={52} />
              <Flex gap={2}>
                <Typography type='body' size='medium' style={styles.conversationPadding}>
                  {person.item.first_name} {person.item.last_name}
                </Typography>
                <Typography
                  color='grey300'
                  type='label'
                  size='small'
                  numberOfLines={1}
                  style={styles.conversationPadding}
                >
                  @{person.item.username}
                </Typography>
              </Flex>
            </Flex>
            <Flex alignItems='center' style={styles.checkboxContainer}>
              {checkedItems[person.item.id] ? (
                <Icon name='radio-button-on' size={normalize(20)} color={colorPalette.primary400} />
              ) : (
                <Icon name='radio-button-off' size={normalize(20)} color={colorPalette.white} />
              )}
            </Flex>
          </Flex>
        </TouchableOpacity>
      );
    },
    [checkedItems, handleCheckboxChange],
  );

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex style={styles.headerContainer}>
        <ScreenHeader titleSize='small' withBackButton title={t('messages.newMessage')}>
          <IconButton type='primary' disabled={!showButton} iconName='checkmark' onPress={goToChat} />
        </ScreenHeader>
      </Flex>
      <TextInput
        value={search}
        label='To'
        withBorder
        onChangeText={handleSearch}
        placeholder={t('common.search')}
        containerStyle={styles.inputContainer}
      />
      <FlatList
        data={users}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={renderPersons}
      />
    </SafeAreaView>
  );
};
