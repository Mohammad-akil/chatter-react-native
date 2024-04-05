import { type FC, memo, useCallback } from 'react';
import { type StyleProp, type ViewStyle, type ListRenderItem, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

import MomentPreviewCard from '~/components/MomentPreviewCard';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';
import { commonStyles } from '~/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { colorPalette } from '~/styles/colors';

const moment = {
  id: 1,
  title: 'Why our reefs are dying',
  viewed: 1345,
  liked: 120,
  previewVideo:
    'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?cs=srgb&dl=pexels-hannah-nelson-1065084.jpg&fm=jpg',
};

type Moment = typeof moment;

type MomentsSectionProps = {
  style?: StyleProp<ViewStyle>;
  moments: Moment[];
  componentPadding?: boolean;
};

const MomentsSection: FC<MomentsSectionProps> = ({ style, moments, componentPadding }) => {
  const { t } = useTranslation();
  const containerPadding = componentPadding ? { ...commonStyles.baseScreenPadding } : {};
  const renderItem: ListRenderItem<Moment> = useCallback(({ item }) => {
    return (
      <MomentPreviewCard title={item.title} previewVideo={item.previewVideo} viewed={item.viewed} liked={item.liked} />
    );
  }, []);

  return (
    <Flex style={style} gap={24}>
      <Flex flexDirection='row' style={containerPadding} gap={4} alignItems='center'>
        <Typography type='headline' size='medium'>
          {t('common.moments')}
        </Typography>
        <Icon name='chevron-forward-outline' size={24} color={colorPalette.white} />
      </Flex>
      <FlatList
        data={moments}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.flatlistContentContainer, containerPadding]}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
      />
    </Flex>
  );
};

export default memo(MomentsSection);

const styles = StyleSheet.create({
  flatlistContentContainer: {
    gap: 4,
  },
});
