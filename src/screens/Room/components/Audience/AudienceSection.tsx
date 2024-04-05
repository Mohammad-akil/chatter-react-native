import { type FC, memo, useCallback, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type StyleProp, type ViewStyle, StyleSheet, View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { FadeIn, LinearTransition } from 'react-native-reanimated';

import { UserMetadata } from '~/entities/User';
import { normalize } from '~/utils/normalize';

import Flex, { AnimatedFlex } from '~/ui/Flex';
import Typography from '~/ui/Typography';

import AudienceParticipant from './AudienceParticipant';
import { ListenerParticipant } from '~/entities/Room';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { commonStyles } from '~/styles';
import { useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';

type AudienceSectionProps = {
  style?: StyleProp<ViewStyle>;
  listeners: ListenerParticipant[];
};

const Separator = memo(() => {
  return <View style={styles.separator} />;
});

const AudienceSection: FC<AudienceSectionProps> = ({ style, listeners }) => {
  const { t } = useTranslation();
  const [_participants, _setParticipants] = useState([...listeners]);
  const list = useRef<FlashList<ListenerParticipant> | null>(null);

  const setParticipantInfoPopup = useSetRecoilState(state.participantInfoPopupState);
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);

  useEffect(() => {
    _setParticipants([...listeners]);
  }, [listeners]);

  useEffect(() => {
    list.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext({
      duration: 300,
      update: { type: 'easeInEaseOut', property: 'opacity' },
      create: { type: 'easeInEaseOut', property: 'opacity' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
  }, [_participants]);

  const openParticipantInfo = useCallback(
    (participant: UserMetadata) => {
      setParticipantInfoPopup({
        open: true,
        participantInfo: participant,
      });
      setRoomControlsOpened(false);
    },
    [setParticipantInfoPopup, setRoomControlsOpened],
  );

  const renderItem = useCallback<ListRenderItem<ListenerParticipant>>(
    ({ item }) => {
      const _openParticipantInfo = () => {
        openParticipantInfo({
          user_id: item.user.id,
          user_first_name: item.user.first_name,
          user_last_name: item.user.last_name,
          user_username: item.user.username,
          user_avatar: item.user.avatar,
          role: 'listener',
          verified: item.user.verified,
        });
      };
      return (
        <TouchableOpacity onPress={_openParticipantInfo}>
          <AudienceParticipant listener={item} />
        </TouchableOpacity>
      );
    },
    [openParticipantInfo],
  );

  return (
    <AnimatedFlex layout={LinearTransition.duration(200)} entering={FadeIn.duration(200)} style={style} gap={16}>
      <Flex style={styles.title} flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Flex flexDirection='row' alignItems='center' gap={12}>
          <Typography type='headline' size='small'>
            {t('room.audience')}
          </Typography>
          <Typography type='label' size='medium'>
            {listeners.length}
          </Typography>
        </Flex>
      </Flex>
      <View style={styles.participantsListWrapper}>
        <FlashList
          ref={list}
          scrollEnabled={false}
          data={_participants}
          keyExtractor={(item) => item.id}
          numColumns={4}
          estimatedItemSize={85}
          ItemSeparatorComponent={Separator}
          renderItem={renderItem}
        />
      </View>
    </AnimatedFlex>
  );
};

export default memo(AudienceSection);

const styles = StyleSheet.create({
  title: {
    paddingVertical: normalize(10),
    ...commonStyles.baseScreenPadding,
  },
  participantsListWrapper: {
    minHeight: 85,
    paddingHorizontal: normalize(10),
  },
  separator: {
    width: '100%',
    height: normalize(16),
  },
});
