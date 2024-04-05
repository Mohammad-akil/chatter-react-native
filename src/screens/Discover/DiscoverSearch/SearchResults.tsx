import { type FC, memo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { SearchResponse } from '~/api/services/search/types';

import ChannelDisplayCard from '~/components/ChannelDisplayCard';
import ProfileItem from '~/components/ProfileItem';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';
import Skeleton from '~/ui/Skeleton';

type SearchResultsProps = {
  style?: StyleProp<ViewStyle>;
  searchValue: string;
  loading: boolean;
  searchResults?: SearchResponse;
};

const SearchResults: FC<SearchResultsProps> = ({ style, searchValue, loading, searchResults }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  if (loading) {
    return (
      <Flex gap={24}>
        {Array.from({ length: 10 }).map((_, index) => {
          return (
            <Flex key={index} flexDirection='row' gap={4}>
              <Skeleton width={48} height={48} borderRadius={360} />
              <Flex flex={1} gap={4}>
                <Skeleton width={'100%'} height={20} borderRadius={6} />
                <Skeleton width={'100%'} height={20} borderRadius={6} />
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    );
  }

  if (!searchResults || searchValue === '') {
    return (
      <Typography type='label' size='small'>
        {t('discover.search')}
      </Typography>
    );
  }

  return (
    <>
      {searchResults.users.length > 0 && (
        <Flex gap={24}>
          {searchResults.users.map((user) => {
            const goToUser = () => {
              navigate('PreviewProfile', { user_id: user.id });
            };
            return (
              <TouchableOpacity onPress={goToUser} key={user.id}>
                <ProfileItem
                  size='large'
                  avatar={user.avatar}
                  firstName={user.first_name}
                  lastName={user.last_name}
                  userName={user.username}
                />
              </TouchableOpacity>
            );
          })}
        </Flex>
      )}
      {searchResults.channels.length > 0 && (
        <Flex gap={16}>
          <Typography type='headline' size='medium'>
            Channels
          </Typography>
          <Flex gap={24}>
            {searchResults.channels.map((channel) => {
              const goToChannel = () => {
                navigate('PreviewChannel', { channel_id: channel.id });
              };

              return (
                <TouchableOpacity onPress={goToChannel} key={channel.id}>
                  <ChannelDisplayCard avatar={channel.avatar} title={channel.name} />
                </TouchableOpacity>
              );
            })}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default memo(SearchResults);
