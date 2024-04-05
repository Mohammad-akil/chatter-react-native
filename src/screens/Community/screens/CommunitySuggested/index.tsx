import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItem, PermissionsAndroid, Platform, SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import Contacts, { PhoneNumber } from 'react-native-contacts';
import { errorPermissions } from '~/utils';
import { api } from '~/api';
import { useMutation } from '@tanstack/react-query';
import { SuggestedUsersResponse } from '~/api/services/community/types';
import Avatar from '~/ui/Avatar';
import { normalize } from '~/utils/normalize';
import { useRecoilState } from 'recoil';
import { suggestedFromContactsState } from '../../state';
import VerifiedIcon from '~/ui/VerifiedIcon';

type ContactNumberType = {
  label: string;
  number: string;
};

const CommunitySuggested = () => {
  const { t } = useTranslation();
  const [usersFromContacts, setUsersFromContacts] = useRecoilState(suggestedFromContactsState);

  const { mutate, data, isSuccess } = useMutation({
    mutationFn: (numbersData: ContactNumberType[]) => api.community.getUsersFromContacts(numbersData),
  });

  const getContacts = useCallback(async () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        .then((response) => {
          if (response === 'never_ask_again' || response === 'denied') {
            errorPermissions();
          } else {
            const cont: PhoneNumber[] = [];
            Contacts.getAll().then((contacts) => {
              contacts.map((contact) => {
                cont.push(...contact.phoneNumbers);
              });
              mutate(cont);
            });
          }
        })
        .catch((error) => {
          errorPermissions();
          return console.log(error);
        });
    } else {
      const cont: PhoneNumber[] = [];
      Contacts.getAll()
        .then((contacts) => {
          contacts.map((contact) => {
            cont.push(...contact.phoneNumbers);
          });
          mutate(cont);
        })
        .catch((error) => {
          errorPermissions();
          return console.log(error);
        });
    }
  }, [mutate]);

  useEffect(() => {
    isSuccess && setUsersFromContacts(data);
  }, [data, isSuccess, setUsersFromContacts]);

  const renderItem: ListRenderItem<SuggestedUsersResponse> = useCallback(
    ({ item }) => {
      return (
        <Flex gap={6}>
          <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
            <Flex flexDirection='row' alignItems='center' gap={4}>
              <Avatar url={item.avatar} size={52} />
              <Flex gap={2}>
                {item.verified && (
                  <Flex flexDirection='row' alignItems='center'>
                    <VerifiedIcon />
                    <Typography type='body' size='medium' style={styles.conversationPadding}>
                      {item.first_name} {item.last_name}
                    </Typography>
                  </Flex>
                )}
                <Typography
                  color='grey300'
                  type='label'
                  size='small'
                  numberOfLines={1}
                  style={styles.conversationPadding}
                >
                  @{item.username}
                </Typography>
              </Flex>
            </Flex>
            <Flex gap={12} flexDirection='row'>
              <IconButton type='ghost' iconName='remove' />
              <IconButton iconName='add' />
            </Flex>
          </Flex>
          <Typography type='body' size='small' color='warning400'>
            {t('common.foundInContacts')}
          </Typography>
        </Flex>
      );
    },
    [t],
  );

  if (usersFromContacts.length === 0) {
    return (
      <SafeAreaView style={commonStyles.baseSafeArea}>
        <ScreenHeader style={commonStyles.baseScreenPadding} withBackButton title={t('common.suggested')}>
          <Flex flexDirection='row' alignItems='center' gap={8}>
            <Typography type='label' size='small'>
              {t('common.findFriends')}
            </Typography>
            <IconButton iconName='people-sharp' onPress={getContacts} />
          </Flex>
        </ScreenHeader>
        <Flex flex={1} justifyContent='center' alignItems='center'>
          <Typography type='label' size='large'>
            {t('common.nothingToSeeHere')}
          </Typography>
          <Button type='link' text={t('common.syncFriends')} size='md' onPress={getContacts} />
        </Flex>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex flex={1} style={commonStyles.baseScreenPadding}>
        <Flex style={{ paddingBottom: normalize(20) }}>
          <ScreenHeader withBackButton title={t('common.suggested')}>
            <Flex flexDirection='row' alignItems='center' gap={8}>
              <Typography type='label' size='small'>
                {t('common.findFriends')}
              </Typography>
              <IconButton iconName='people-sharp' onPress={getContacts} />
            </Flex>
          </ScreenHeader>
        </Flex>
        <FlatList data={usersFromContacts} renderItem={renderItem} contentContainerStyle={styles.container} />
      </Flex>
    </SafeAreaView>
  );
};
export const styles = StyleSheet.create({
  container: { gap: normalize(32) },
  conversationPadding: {
    padding: normalize(4),
  },
});

export default memo(CommunitySuggested);
