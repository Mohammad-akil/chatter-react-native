import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRecoilState } from 'recoil';

import { useStorageUser } from '~/services/mmkv/auth';

import EditImageModal from '~/components/EditImageModal';
import Flex from '~/ui/Flex';

import ChannelInfo from '../../components/ChannelInfo';
import ChannelTabs from '../../components/ChannelTabs';
import { EmptyList } from '../../components/EmptyList';

import { channelId, channelState, channelWasCreated } from '../../state';
import { commonStyles } from '~/styles';
import { styles } from './styles';
import { useEditImage } from '../../hooks/useEditImage';
import ChannelHeader from '../../components/ChannelHeader';
import { useMutation } from '@tanstack/react-query';
import { api } from '~/api';

const Channel = () => {
  const { navigate } = useNavigation();
  const [user] = useStorageUser();

  const [selectedChannelId, setSelectedChannelId] = useRecoilState(channelId);
  const [channel, setChannel] = useRecoilState(channelState);
  const [isChannelCreated, setIsChannelCreated] = useRecoilState(channelWasCreated);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { data, mutate, isSuccess } = useMutation({
    mutationFn: (id: string) => api.channel.getChannel(id),
  });
  const { chooseImage, removeImage } = useEditImage({ selectedChannelId, setModalIsOpen });

  useEffect(() => {
    if (channel?.id) {
      return setSelectedChannelId(channel.id);
    }
    if (user?.id && user?.owned_channels.length > 0) {
      setSelectedChannelId(user?.owned_channels[0].id);
    }
  }, [channel?.id, setSelectedChannelId, user?.id, user?.owned_channels]);

  useEffect(() => {
    if (selectedChannelId) {
      mutate(selectedChannelId);
    }
  }, [mutate, selectedChannelId, setChannel]);

  useEffect(() => {
    if (isSuccess) {
      setChannel(data.channel);
      console.log(data);
    }
  }, [data, isSuccess, setChannel]);

  useEffect(() => {
    if (isChannelCreated) {
      setIsChannelCreated(false);
    }
  }, [isChannelCreated, selectedChannelId, setIsChannelCreated]);

  if (user && user?.owned_channels.length < 1) {
    return (
      <SafeAreaView style={[commonStyles.baseSafeArea, commonStyles.baseScreenPadding]}>
        <EmptyList
          goToCreate={() => {
            navigate('CreateChannel');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <Flex>
        {user && (
          <ChannelHeader
            style={styles.header}
            view='owner'
            user={user}
            selectedChannelId={selectedChannelId}
            setSelectedChannelId={setSelectedChannelId}
          />
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.contentScroll, commonStyles.baseScreenPadding]}
        >
          {channel && (
            <>
              <ChannelInfo
                view='owner'
                channel={channel}
                selectedChannelId={selectedChannelId}
                setModalIsOpen={setModalIsOpen}
                setChannel={setChannel}
                leadersImages={[
                  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
                  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
                  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
                  'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
                ]}
              />
              <ChannelTabs view='owner' style={styles.channelTabs} />
            </>
          )}
          {modalIsOpen && (
            <EditImageModal
              setIsModalOpen={setModalIsOpen}
              isModalOpen={modalIsOpen}
              choosePhotoFunc={chooseImage}
              removePhotoFunc={removeImage}
            />
          )}
        </ScrollView>
      </Flex>
    </SafeAreaView>
  );
};

export default Channel;
