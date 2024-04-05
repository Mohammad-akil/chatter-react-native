import { useNavigation } from '@react-navigation/native';
import { Dispatch, FC, SetStateAction, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import BlurMenu from '~/components/BlurMenu';
import { BlurMenuItem } from '~/components/BlurMenu/types';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';

interface CommonHeaderProps {
  tabs: BlurMenuItem[];
  tab: string;
  setTab: Dispatch<SetStateAction<string>>;
}
const CommonHeader: FC<CommonHeaderProps> = ({ tabs, tab, setTab }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const containerStyles = [commonStyles.baseScreenPadding, { paddingTop: Platform.OS === 'android' ? 20 : 0 }];
  const handleNavigateToSearch = () => {
    navigate('DiscoverSearch');
  };

  return (
    <Flex gap={8} style={containerStyles}>
      <ScreenHeader title={t('discover.title')} style={commonStyles.zeroPadding}>
        <IconButton iconName='search' onPress={handleNavigateToSearch} />
      </ScreenHeader>
      <BlurMenu tabs={tabs} defaultTab={tab} handleTabChange={setTab} />
    </Flex>
  );
};

export default memo(CommonHeader);
