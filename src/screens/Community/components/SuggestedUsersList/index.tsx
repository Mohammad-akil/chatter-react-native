import { memo, useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Flex from '~/ui/Flex';
import { SuggestedUserTypes, suggestedUsers } from './data';
import Avatar from '~/ui/Avatar';
import { normalize } from '~/utils/normalize';
import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import { useTranslation } from 'react-i18next';
import { colorPalette } from '~/styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '~/styles';

const SuggestedUsersList = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const goToSuggested = useCallback(() => {
    navigate('CommunitySuggested');
  }, [navigate]);
  const renderItem = useCallback(({ item }: { item: SuggestedUserTypes }) => {
    return (
      <Flex gap={16}>
        <Avatar url={item.avatar} size={80} />
        <Flex gap={6} alignItems='center'>
          <Typography type='label' size='medium'>
            {item.first_name} {item.last_name}
          </Typography>
          <Typography type='body' size='small'>
            @{item.username}
          </Typography>
        </Flex>
        <Flex gap={4} flexDirection='row'>
          <IconButton type='ghost' iconName='remove' />
          <IconButton iconName='add' />
        </Flex>
      </Flex>
    );
  }, []);
  return (
    <Flex gap={20}>
      <TouchableOpacity onPress={goToSuggested} style={styles.suggestedButton}>
        <Typography type='headline' size='small'>
          {t('common.suggestedUsers')}
        </Typography>
        <Icon name='chevron-forward-outline' size={24} color={colorPalette.white} />
      </TouchableOpacity>
      <FlatList
        contentContainerStyle={styles.container}
        data={suggestedUsers}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
      />
    </Flex>
  );
};

const styles = StyleSheet.create({
  container: { gap: normalize(32), paddingHorizontal: normalize(20) },
  suggestedButton: { gap: 4, flexDirection: 'row', ...commonStyles.baseScreenPadding },
});
export default memo(SuggestedUsersList);
