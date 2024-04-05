import { Pressable, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Purchases, { PurchasesStoreProduct } from 'react-native-purchases';
import Typography from '~/ui/Typography';
import { SafeAreaView, StyleSheet } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import JSONTree from 'react-native-json-tree';
import { ScrollView } from 'react-native-gesture-handler';
import Collapsible from 'react-native-collapsible';
import { BlurView } from '@react-native-community/blur';
type CollapseItem = {
  id: string;
  open: boolean;
};
const IAP = () => {
  const [isCollapsed, setIsCollapsed] = useState<CollapseItem[]>([]);

  const [offerings, setOfferings] = useState<PurchasesStoreProduct[] | null>(null);

  const checkIfOpen = useCallback(
    (item: string) => {
      if (offerings && offerings.length > 0) {
        const openItems = isCollapsed.filter((collapseItem) => collapseItem.id === item);
        if (openItems.length > 0) {
          return !openItems[0].open;
        }
      }
    },
    [isCollapsed, offerings],
  );
  function setCollapsed(item: string) {
    console.log('Setting collapsed', item);
    setIsCollapsed((prevState) =>
      prevState.map((collapseItem) =>
        collapseItem.id === item ? { ...collapseItem, open: !collapseItem.open } : collapseItem,
      ),
    );
  }
  async function fetchOfferings() {
    console.log(await Purchases.getOfferings());
    const products = await Purchases.getProducts([
      'pro_monthly',
      'pro_yearly',
      'contribution_5',
      'chatter_pro:pro-monthly-base',
    ]);
    setOfferings(products);
  }
  useEffect(() => {
    const init: any[] = [];
    offerings?.forEach((item) => {
      init.push({ id: item.identifier, open: false });
    });
    setIsCollapsed(init);
  }, [offerings]);
  async function testPurchase(product: PurchasesStoreProduct) {
    try {
      const purchase = await Purchases.purchaseStoreProduct(product);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchOfferings();
  }, []);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        withBackButton={true}
        style={commonStyles.baseScreenPadding}
        title={'In-App Payments Testing'}
      ></ScreenHeader>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <Flex gap={12} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
          {offerings?.map((item, index) => (
            <BlurView
              key={index}
              blurType='dark'
              blurAmount={80}
              style={{ padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 25 }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <Typography style={{ fontSize: 18 }}>{item.title}</Typography>
                <Typography style={{ fontSize: 12 }}>({item.productCategory})</Typography>
              </View>
              <Typography style={{ marginTop: 10, fontSize: 14 }}>{item.description}</Typography>
              <Typography style={{ marginVertical: 10 }}>{item.priceString}</Typography>
              <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                <Pressable
                  style={{
                    marginTop: 10,
                    padding: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 25,
                    shadowRadius: 20,
                    alignContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setCollapsed(item.identifier);
                  }}
                >
                  <Typography style={{ padding: 2, paddingHorizontal: 8 }}>View JSON</Typography>
                </Pressable>
                <Pressable
                  style={{
                    marginTop: 10,
                    padding: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 25,
                    shadowRadius: 20,
                    alignContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    testPurchase(item);
                  }}
                >
                  <Typography style={{ padding: 2, paddingHorizontal: 8 }}>Test Purchase</Typography>
                </Pressable>
              </View>
              <Collapsible collapsed={checkIfOpen(item.identifier)} style={{ marginVertical: 12 }}>
                <JSONTree data={item as any} hideRoot={true} />
              </Collapsible>
            </BlurView>
          ))}
        </Flex>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  generalContainer: {
    paddingTop: normalize(16),
    paddingBottom: normalize(30),
  },
  buttonLink: {
    paddingVertical: 8,
  },
  subtitle: {
    maxWidth: '100%',
  },
});
export default IAP;
