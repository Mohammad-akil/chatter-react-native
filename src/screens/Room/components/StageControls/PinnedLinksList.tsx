import { type FC, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { type StyleProp, type ViewStyle, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { LinearTransition } from 'react-native-reanimated';
import { useRecoilValue } from 'recoil';
import { api } from '~/api';
import { PinnedLink } from '~/entities/Room';
import Button from '~/ui/Button';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import { state } from '../../state/roomState';

type PinnedLinksListProps = {
  style?: StyleProp<ViewStyle>;
  pinnedLinks: PinnedLink[];
};

const PinnedLinksList: FC<PinnedLinksListProps> = ({ style, pinnedLinks }) => {
  const { t } = useTranslation();
  const roomDetails = useRecoilValue(state.roomDetailsState);

  const deleteAllLinks = useCallback(() => {
    if (roomDetails?.id) {
      api.room.deletePinnedLinks(roomDetails.id);
    }
  }, [roomDetails?.id]);

  const renderLinks = useCallback<ListRenderItem<PinnedLink>>(({ item }) => {
    const deleteLink = () => {
      api.room.deletePinnedLink(item.link.id);
    };

    return (
      <Flex flexDirection='row' alignItems='center'>
        <Flex flex={1} gap={4}>
          <Typography type='body' size='small' color='textSecondary'>
            {item.link.sitename}
          </Typography>
          <Typography type='body' numberOfLines={1} size='medium' color='textDefault'>
            {item.link.title}
          </Typography>
        </Flex>
        <IconButton type='text' iconName='remove' size='xl' onPress={deleteLink} />
      </Flex>
    );
  }, []);

  return (
    <AnimatedFlex style={style} gap={8} layout={LinearTransition.duration(300)}>
      <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
        <Typography type='label' size='large'>
          {t('room.pinned')}
        </Typography>
        <Button type='text' size='sm' text={t('common.clearAll')} onPress={deleteAllLinks} />
      </Flex>
      <FlatList
        contentContainerStyle={{ gap: 16 }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        data={pinnedLinks}
        renderItem={renderLinks}
      />
    </AnimatedFlex>
  );
};

export default memo(PinnedLinksList);
