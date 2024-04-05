import { type FC, memo } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ScrollView, StyleSheet } from 'react-native';

import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';
import Creator from '../Creator';

import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';
import type { CreatorCategory as CreatorCategoryType } from '../../Creators/types';

type CreatorCategoryProps = {
  onSelect: (id: string) => void;
  selectedIds: string[];
} & CreatorCategoryType;

const CreatorCategory: FC<CreatorCategoryProps> = ({ title, creators, onSelect, selectedIds }) => {
  return (
    <Flex gap={18}>
      <Flex alignItems='flex-end' gap={2} flexDirection='row'>
        <Typography type='label' size='large'>
          {title}
        </Typography>
        <Icon name='chevron-forward-outline' color={colorPalette.white} size={normalize(18)} />
      </Flex>
      <ScrollView contentContainerStyle={styles.creators} horizontal showsHorizontalScrollIndicator={false}>
        {creators.map((creator) => {
          const isSelected = selectedIds.includes(creator.id);
          return <Creator {...creator} onSelect={onSelect} isSelected={isSelected} key={creator.id} />;
        })}
      </ScrollView>
    </Flex>
  );
};

export default memo(CreatorCategory);

const styles = StyleSheet.create({
  creators: {
    flexDirection: 'row',
    gap: 3,
  },
});
