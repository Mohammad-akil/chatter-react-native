import { type FC, memo, useCallback, useState } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { TextInput } from '~/ui/TextInput';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import { TextArea } from '~/ui/TextArea';
import { colorPalette, colors } from '~/styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '~/ui/Button';
import ChatterIcon from '~/ui/ChatterIcon';
import Select, { SelectOption } from '~/ui/Select';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';

type RoomSettingsProps = {
  style?: StyleProp<ViewStyle>;
};

const privacyOptions: SelectOption[] = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'Social', value: 'social' },
];

const chatPermissionOptions: SelectOption[] = [{ label: 'Members only', value: 'members' }];
const raiseHandPermissionOptions: SelectOption[] = [{ label: 'Everyone', value: 'everyone' }];
const shareVideoPermissionOptions: SelectOption[] = [{ label: 'Everyone', value: 'everyone' }];

const RoomSettings: FC<RoomSettingsProps> = () => {
  const { goBack } = useNavigation();

  const roomDetails = useRecoilValue(state.roomDetailsState);
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);

  const [selectedPrivacy, setSelectedPrivacy] = useState(privacyOptions[0]);
  const [selectedChatPermission, setSelectedChatPermission] = useState(chatPermissionOptions[0]);
  const [selectedRaiseHandPermission, setSelectedRaiseHandPermission] = useState(raiseHandPermissionOptions[0]);
  const [selectedShareVideoPermission, setSelectedShareVideoPermission] = useState(shareVideoPermissionOptions[0]);

  const handleSelectPrivacy = useCallback((option: SelectOption) => {
    setSelectedPrivacy(option);
  }, []);

  const handleSelectChatPermission = useCallback((option: SelectOption) => {
    setSelectedChatPermission(option);
  }, []);

  const handleSelectRaiseHandPermission = useCallback((option: SelectOption) => {
    setSelectedRaiseHandPermission(option);
  }, []);

  const handleSelectShareVideoPermission = useCallback((option: SelectOption) => {
    setSelectedShareVideoPermission(option);
  }, []);

  const onGoBack = useCallback(() => {
    goBack();
    setRoomControlsOpened(true);
  }, [setRoomControlsOpened, goBack]);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        style={commonStyles.baseScreenPadding}
        withBackButton
        title='Room settings'
        titleSize='medium'
        onBack={onGoBack}
      />
      <ScrollView
        contentInset={{ bottom: 100 }}
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <Flex gap={32}>
          <Flex gap={4}>
            <Typography type='label' size='large' color='textLabel'>
              Title
            </Typography>
            <TextInput placeholder={roomDetails?.title} inputTypographyType='label' inputTypographySize='large' />
          </Flex>
          <Flex gap={8}>
            <Typography type='label' size='large' color='textLabel'>
              Description
            </Typography>
            <TextArea placeholder={roomDetails?.title} withoutBorder />
          </Flex>
          <Flex gap={8} flexDirection='row' alignItems='center' justifyContent='space-between'>
            <Flex gap={4}>
              <Typography type='label' size='large' color='textLabel'>
                Privacy
              </Typography>
              <Typography type='body' size='default' color='textSecondary'>
                Anyone can join this room
              </Typography>
            </Flex>
            <Select
              selectKey='privacy'
              selectedOption={selectedPrivacy}
              setSelectedOption={handleSelectPrivacy}
              options={privacyOptions}
            />
          </Flex>
        </Flex>
        <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
          <Flex gap={4}>
            <Typography type='headline' size='medium' color='textLabel'>
              Recording
            </Typography>
            <Typography type='body' size='medium' color='textSecondary'>
              Anyone can join this room
            </Typography>
          </Flex>
          <Switch trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }} value={true} />
        </Flex>
        <Flex gap={32}>
          <Typography type='headline' size='medium' color='textLabel'>
            Permissions
          </Typography>
          <Flex gap={24}>
            <Flex gap={8} flexDirection='row' alignItems='center' justifyContent='space-between'>
              <Flex style={styles.width60} gap={4}>
                <Typography type='label' size='large' color='textLabel'>
                  Chat
                </Typography>
                <Typography type='body' size='default' color='textSecondary'>
                  Who can speak in the room
                </Typography>
              </Flex>
              <Select
                selectKey='chat'
                selectedOption={selectedChatPermission}
                setSelectedOption={handleSelectChatPermission}
                options={chatPermissionOptions}
              />
            </Flex>
            <Flex gap={8} flexDirection='row' alignItems='center' justifyContent='space-between'>
              <Flex style={styles.width60} gap={4}>
                <Typography type='label' size='large' color='textLabel'>
                  Raise hand
                </Typography>
                <Typography type='body' size='default' color='textSecondary'>
                  Choose who can request to speak
                </Typography>
              </Flex>
              <Select
                selectKey='raisehand'
                selectedOption={selectedRaiseHandPermission}
                setSelectedOption={handleSelectRaiseHandPermission}
                options={raiseHandPermissionOptions}
              />
            </Flex>
            <Flex gap={8} flexDirection='row' alignItems='center' justifyContent='space-between'>
              <Flex style={styles.width60} gap={4}>
                <Typography type='label' size='large' color='textLabel'>
                  Share video
                </Typography>
                <Typography type='body' size='default' color='textSecondary'>
                  Choose who can record their screen and share video
                </Typography>
              </Flex>
              <Select
                selectKey='sharevideo'
                selectedOption={selectedShareVideoPermission}
                setSelectedOption={handleSelectShareVideoPermission}
                options={shareVideoPermissionOptions}
              />
            </Flex>
          </Flex>
        </Flex>
        <Flex gap={32}>
          <Flex gap={4}>
            <Typography type='headline' size='medium' color='textLabel'>
              Multi-stream
            </Typography>
            <Typography type='body' size='medium' color='textSecondary'>
              Enabling multi-stream will also enable recording
            </Typography>
          </Flex>
          <Flex gap={24}>
            <Flex gap={4}>
              <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
                <Flex flexDirection='row' alignItems='center' gap={16}>
                  <Icon name='logo-instagram' size={24} color={colors.text.textDefault} />
                  <Typography type='label' size='large'>
                    Instagram
                  </Typography>
                </Flex>
                <Button type='link' size='md' text='Link' />
              </Flex>
            </Flex>
            <Flex gap={4}>
              <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
                <Flex flexDirection='row' alignItems='center' gap={16}>
                  <ChatterIcon name='x' size={20} color={colors.text.textDefault} />
                  <Typography type='label' size='large'>
                    X
                  </Typography>
                </Flex>
                <Button type='link' size='md' text='Link' />
              </Flex>
            </Flex>
            <Flex gap={4}>
              <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
                <Flex flexDirection='row' alignItems='center' gap={16}>
                  <Icon name='logo-youtube' size={24} color={colors.text.textDefault} />
                  <Typography type='label' size='large'>
                    YouTube
                  </Typography>
                </Flex>
                <Button type='link' size='md' text='Link' />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(RoomSettings);

const styles = StyleSheet.create({
  scrollViewContainer: {
    ...commonStyles.baseScreenPadding,
    paddingTop: normalize(24),
    gap: normalize(56),
  },

  width60: {
    width: '60%',
  },
});
