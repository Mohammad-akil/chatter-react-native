import { type FC, memo, useCallback, useEffect, useState } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Purchases, { PRODUCT_CATEGORY, PurchasesStoreProduct } from 'react-native-purchases';

import { useRecoilState } from 'recoil';

import { colors } from '~/styles/colors';
import Button from '~/ui/Button';
import Flex, { AnimatedFlex } from '~/ui/Flex';
import IconButton from '~/ui/IconButton';
import Typography from '~/ui/Typography';
import { normalize } from '~/utils/normalize';
import { contributionPopupOpenedState, selectedContributionState } from '../../state/chatState';
import { useTranslation } from 'react-i18next';

type ContributeProps = {
  style?: StyleProp<ViewStyle>;
};

const Contribute: FC<ContributeProps> = ({ style }) => {
  const [selectedContribution, setSelectedContribute] = useRecoilState(selectedContributionState);
  const [_, setContributionPopupOpened] = useRecoilState(contributionPopupOpenedState);
  const [products, setProducts] = useState<PurchasesStoreProduct[]>([]);
  const { t } = useTranslation();

  const closePopup = useCallback(() => {
    setContributionPopupOpened(false);
    setSelectedContribute(null);
  }, [setContributionPopupOpened, setSelectedContribute]);

  useEffect(() => {
    const init = async () => {
      const products = await Purchases.getProducts(['cc_5'], PRODUCT_CATEGORY.NON_SUBSCRIPTION);
      setProducts([...products]);
    };
    init();
  }, []);

  return (
    <AnimatedFlex style={style}>
      <Flex style={[styles.content, style]} gap={8}>
        <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
          <Typography type='headline' size='small'>
            {t('room.contribute')}
          </Typography>
          <IconButton type='text' iconName='close' sizeOfIcon={24} style={styles.closeButton} onPress={closePopup} />
        </Flex>
        <Typography type='body' size='semibold'>
          {t('room.elevateYourMessage')}
        </Typography>
        <ScrollView keyboardShouldPersistTaps='always' showsHorizontalScrollIndicator={false} horizontal>
          <Flex flexDirection='row' gap={6}>
            {products.map((item) => {
              const isAlreadySelected = item.identifier === selectedContribution?.identifier;
              const selectContributeAmount = () => {
                if (isAlreadySelected) {
                  setSelectedContribute(null);
                } else {
                  setSelectedContribute(item);
                }
              };

              return (
                <Button
                  active={isAlreadySelected}
                  style={styles.contributeOptionButton}
                  type='contribute-option'
                  size='2xl'
                  text={`$${Math.round(item.price)}`}
                  key={item.identifier}
                  onPress={selectContributeAmount}
                />
              );
            })}
          </Flex>
        </ScrollView>
      </Flex>
    </AnimatedFlex>
  );
};

export default memo(Contribute);

const styles = StyleSheet.create({
  base: {},
  content: {
    backgroundColor: colors.surface.surfaceComponent,
    padding: normalize(16),
    borderRadius: 6,
  },
  closeButton: {
    borderRadius: 6,
    paddingBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  contributeOptionButton: {
    borderRadius: 360,
  },
});
