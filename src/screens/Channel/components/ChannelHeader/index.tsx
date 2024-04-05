import { type FC, memo, useCallback } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Flex from '~/ui/Flex';
import ChannelMenu from '../ChannelMenu';
import IconButton from '~/ui/IconButton';
import { User } from '~/entities/User';
import { SetterOrUpdater } from 'recoil';
import { useNavigation } from '@react-navigation/native';

type ChannelHeaderProps = {
  style?: StyleProp<ViewStyle>;
} & (
  | { view: 'preview'; user?: undefined; selectedChannelId?: undefined; setSelectedChannelId?: undefined }
  | { view: 'owner'; user: User; selectedChannelId: string; setSelectedChannelId: SetterOrUpdater<string> }
);

const ChannelHeader: FC<ChannelHeaderProps> = ({
  style,
  view = 'preview',
  selectedChannelId = undefined,
  setSelectedChannelId = undefined,
  user,
}) => {
  const { navigate, goBack } = useNavigation();

  const goToEdit = useCallback(() => {
    navigate('EditChannel');
  }, [navigate]);

  return (
    <Flex style={style} justifyContent='space-between' flexDirection='row'>
      <Flex>
        {view === 'owner' ? (
          <ChannelMenu
            userChannels={user!.owned_channels}
            setSelectedChannelId={setSelectedChannelId!}
            selectedChannelId={selectedChannelId!}
          />
        ) : (
          <IconButton type='secondary' size='xl' iconName='chevron-back' onPress={goBack} />
        )}
      </Flex>
      <Flex flexDirection='row' gap={12}>
        <IconButton iconName='ellipsis-horizontal' type='text' />
        <IconButton iconName='share-outline' type='text' />
        {view === 'owner' && <IconButton iconName='pencil' type='secondary' onPress={goToEdit} />}
      </Flex>
    </Flex>
  );
};

export default memo(ChannelHeader);
