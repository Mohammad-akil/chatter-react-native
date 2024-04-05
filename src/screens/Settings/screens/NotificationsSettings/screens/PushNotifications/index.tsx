import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Switch } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';

import { useNavigation } from '@react-navigation/native';
import { normalize } from '~/utils/normalize';
import LinkButton from '~/screens/Settings/components/LinkButton';
import Typography from '~/ui/Typography';
import { colorPalette } from '~/styles/colors';

const PushNotifications = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [roomInvitations, setRoomInvitations] = useState(false);
  const [reply, setReply] = useState(false);
  const [moment, setMoment] = useState(false);
  const [likes, setLikes] = useState(false);
  const [followers, setFollowers] = useState(false);
  const [messages, setMessages] = useState(false);
  const [joinedContacts, setJoinedContacts] = useState(false);
  const [roomContacts, setRoomContacts] = useState(false);
  const [events, setEvents] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [coHost, setCoHost] = useState(false);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        style={commonStyles.baseScreenPadding}
        withBackButton={true}
        title={t('settings.pushNotifications')}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex gap={32} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          <LinkButton
            navigateTo={() => navigate('NotificationsRooms')}
            subtitle='3 channels'
            oneLine
            title={t('settings.rooms')}
          />
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='label' size='large'>
              {t('settings.RoomInvitations')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setRoomInvitations}
              value={roomInvitations}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Flex gap={4} style={styles.descriptionContainer}>
              <Typography type='label' size='large'>
                {t('settings.momentsTags')}
              </Typography>
              <Typography size='default' color='grey300'>
                {t('settings.getNotifiedInAMoment')}
              </Typography>
            </Flex>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setMoment}
              value={moment}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Flex gap={4} style={styles.descriptionContainer}>
              <Typography type='label' size='large'>
                {t('settings.mentionsAndReplies')}
              </Typography>
              <Typography size='default' color='grey300'>
                {t('settings.getNotifiedWhenMentonied')}
              </Typography>
            </Flex>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setReply}
              value={reply}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='label' size='large'>
              {t('settings.likes')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setLikes}
              value={likes}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='label' size='large'>
              {t('settings.newFollowers')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setFollowers}
              value={followers}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='label' size='large'>
              {t('common.directMessages')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setMessages}
              value={messages}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='label' size='large'>
              {t('settings.joinedContacts')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setJoinedContacts}
              value={joinedContacts}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='label' size='large'>
              {t('settings.contactsJoinsRoom')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setRoomContacts}
              value={roomContacts}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Typography type='label' size='large'>
              {t('settings.liveEvents')}
            </Typography>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setEvents}
              value={events}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Flex gap={4} style={styles.descriptionContainer}>
              <Typography type='label' size='large'>
                {t('settings.channelNotifications')}
              </Typography>
              <Typography size='default' color='grey300'>
                {t('settings.relatedToChannels')}
              </Typography>
            </Flex>
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Flex gap={4} style={styles.descriptionContainer}>
              <Typography type='label' size='large'>
                {t('settings.scheduledRooms')}
              </Typography>
              <Typography size='default' color='grey300'>
                {t('settings.notifyNewScheduledRoom')}
              </Typography>
            </Flex>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setCoHost}
              value={coHost}
            />
          </Flex>
          <Flex flexDirection='row' justifyContent='space-between' alignItems='center'>
            <Flex>
              <Typography type='label' size='large'>
                {t('settings.newScheduledRooms')}
              </Typography>
            </Flex>
            <Switch
              trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
              onValueChange={setScheduled}
              value={scheduled}
            />
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
    paddingBottom: normalize(80),
  },
  descriptionContainer: { maxWidth: '50%' },
});

export default memo(PushNotifications);
