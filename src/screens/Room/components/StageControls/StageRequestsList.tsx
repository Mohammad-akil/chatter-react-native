import { type FC, memo, useCallback } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View, ListRenderItem } from 'react-native';
import { FadeOut, LinearTransition } from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import { api } from '~/api';
import { RoomRequest } from '~/entities/Room';

import ProfileItem from '~/components/ProfileItem';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';

import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';

type StageRequestsListProps = {
  style?: StyleProp<ViewStyle>;
  roomRequests: RoomRequest[];
};

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const StageRequestsList: FC<StageRequestsListProps> = ({ roomRequests }) => {
  const { t } = useTranslation();
  const renderRequests = useCallback<ListRenderItem<RoomRequest>>(({ item }) => {
    const approveRequest = async () => {
      await api.room.handleRoomRequest({
        request_id: item.id,
        approved: true,
      });
    };

    const rejectRequest = async () => {
      await api.room.handleRoomRequest({
        request_id: item.id,
        approved: false,
      });
    };

    return (
      <AnimatedFlex
        exiting={FadeOut.duration(200)}
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <ProfileItem avatar={item.user.avatar ?? null} size='small' firstName={item.user.first_name} />
        <Flex gap={4} flexDirection='row' alignItems='center'>
          {item.permission.map((permission, index) => {
            const icon = permission === 'microphone' ? 'mic' : 'videocam';
            return (
              <View key={`${getRandom(1, 100)}${index}`} style={styles.permissionItem}>
                <Icon key={Math.random()} name={icon} size={normalize(20)} color={colorPalette.white} />
              </View>
            );
          })}
          <IconButton iconName='close-outline' size='xl' type='secondary' onPress={rejectRequest} />
          <IconButton iconName='checkmark' size='xl' type='primary' onPress={approveRequest} />
        </Flex>
      </AnimatedFlex>
    );
  }, []);

  return (
    <AnimatedFlex layout={LinearTransition.duration(300)} gap={16}>
      <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Typography type='label' size='large'>
          {t('room.stageRequests')}
        </Typography>
        <Typography type='body' size='semibold' color='primary500'>
          {t('room.roomPermissions')}
        </Typography>
      </Flex>
      <FlatList
        scrollEnabled={false}
        contentContainerStyle={{ gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        data={roomRequests}
        renderItem={renderRequests}
      />
    </AnimatedFlex>
  );
};

export default memo(StageRequestsList);

const styles = StyleSheet.create({
  permissionItem: {
    padding: normalize(12),
  },
});
