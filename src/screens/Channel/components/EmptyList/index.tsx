import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '~/ui/Button';
import Flex from '~/ui/Flex';
import Typography from '~/ui/Typography';

interface EmptyListProps {
  goToCreate: () => void;
}
export const EmptyList: React.FC<EmptyListProps> = memo(({ goToCreate }) => {
  const { t } = useTranslation();
  return (
    <Flex flex={1} justifyContent='center' alignItems='center'>
      <Typography type='headline' size='default'>
        {t('messages.nothing')}
      </Typography>
      <Button type='link' text={t('channel.create')} size='md' onPress={goToCreate} />
    </Flex>
  );
});
