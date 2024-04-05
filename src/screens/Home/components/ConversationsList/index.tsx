import { useNavigation } from '@react-navigation/native';
import { FC, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItem, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { OwnerInfoTypes, ReadyConversationTypes } from '~/entities/Conversations';
import { useStorageUser } from '~/services/mmkv/auth';
import { commonStyles } from '~/styles';
import { colorPalette } from '~/styles/colors';
import Avatar from '~/ui/Avatar';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import ConversationsListSkeleton from '../ConversationsListSkeleton';

interface ConversationsListProps {
  data: ReadyConversationTypes[] | undefined;
  isPending: boolean;
}

const ConversationsList: FC<ConversationsListProps> = ({ data, isPending }) => {
  const { navigate } = useNavigation();
  const [user] = useStorageUser();
  const { t } = useTranslation();

  const handleNavigate = useCallback(
    (index: number) => {
      navigate('ConversationsCarousel', {
        conversations: data,
        index: index,
      });
    },
    [data, navigate],
  );

  const renderItem: ListRenderItem<ReadyConversationTypes> = useCallback(
    ({ item, index }) => {
      const usersInConversation: OwnerInfoTypes[] = [];
      item.content.map((item) => {
        const isUserInConversation = usersInConversation.some((user) => user.id === item.user.id);

        !isUserInConversation && usersInConversation.push(item.user);
      });

      const getWidthStyle = (users: OwnerInfoTypes[]) => {
        switch (users.length) {
          case 1:
            return { width: normalize(65) };
          case 2:
            return { width: normalize(100) };
          default:
            return { width: normalize(135) };
        }
      };
      const getHitSlop = (users: OwnerInfoTypes[]) => {
        switch (users.length) {
          case 2:
            return {
              left: -30,
              right: -100,
            };
          default:
            return {
              left: -30,
              right: -135,
            };
        }
      };
      const content = () => {
        return usersInConversation.slice(0, 3).map((user, index) => {
          if (index === 2 && usersInConversation.length - 3 > 0) {
            return (
              <Flex key={user.id} style={styles.imageStyle}>
                <Flex flexDirection='row' alignItems='center' justifyContent='center' gap={2} style={styles.followers}>
                  <Typography type='label' size='small'>
                    +{usersInConversation.length - 3}
                  </Typography>
                  <Icon name='people-sharp' size={normalize(19)} color={colorPalette.white} />
                </Flex>
                <Avatar url={user.avatar} style={styles.imageStyle} size={65} />
              </Flex>
            );
          } else if (index === 2) {
            return (
              <Flex key={user.id} style={styles.imageStyle}>
                <Avatar url={user.avatar} style={styles.imageStyle} size={65} />
              </Flex>
            );
          }

          if (index === 1) {
            return <Avatar key={user.id} url={user.avatar} style={styles.imageStyle} size={65} />;
          } else {
            return <Avatar key={user.id} url={user.avatar} size={65} />;
          }
        });
      };

      if (item.content.length > 1 && usersInConversation.length > 1) {
        return (
          <TouchableOpacity
            hitSlop={getHitSlop(usersInConversation)}
            onPress={() => handleNavigate(index)}
            style={[styles.listElement, getWidthStyle(usersInConversation)]}
          >
            {content()}
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity onPress={() => handleNavigate(index)}>
            <Avatar url={item.content?.[0].user.avatar} size={65} />
          </TouchableOpacity>
        );
      }
    },
    [handleNavigate],
  );
  console.log(isPending);
  if (isPending) {
    return <ConversationsListSkeleton />;
  }
  return (
    <Flex style={commonStyles.baseScreenPadding}>
      {!data?.length && (
        <Flex flexDirection='row' alignItems='center' gap={8}>
          <TouchableOpacity onPress={() => navigate('NewConversation')}>
            <Avatar size={60} url={user?.avatar} style={styles.userAvatar} />
            <View style={styles.newConversation}>
              <Icon name='add' size={23} color={colorPalette.white} />
            </View>
          </TouchableOpacity>
          <Typography type='body' size='default'>
            {t('common.startConversation')}
          </Typography>
        </Flex>
      )}
      <FlatList
        horizontal
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        showsHorizontalScrollIndicator={false}
      />
    </Flex>
  );
};
const styles = StyleSheet.create({
  flatListContainer: {
    gap: normalize(30),
  },
  listElement: { flexDirection: 'row' },
  imageStyle: { left: -normalize(30) },
  followers: {
    width: normalize(65),
    height: normalize(65),
    borderRadius: normalize(65),
    right: 0,
    left: -normalize(30),
    backgroundColor: 'rgba(130, 124, 113, 0.5)',
    position: 'absolute',
    zIndex: 9999,
  },
  newConversation: {
    width: normalize(60),
    height: normalize(60),
    position: 'absolute',
    borderWidth: 2,
    borderColor: colorPalette.white,
    borderRadius: 60,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: { opacity: 0.5 },
});
export default memo(ConversationsList);
