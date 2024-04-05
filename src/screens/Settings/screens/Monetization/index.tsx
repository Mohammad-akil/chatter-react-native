import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import { WebView } from 'react-native-webview';
import { api } from '~/api';
import Typography from '~/ui/Typography';
import Flex from '~/ui/Flex';
import { normalize } from '~/utils/normalize';
import Button from '~/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { colorPalette } from '~/styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Payments from 'react-native-purchases';

const Monetization = () => {
  const IoniconText = ({
    iconName,
    text,
    subText,
    iconColor,
  }: {
    iconName: string;
    text: string;
    subText: string;
    iconColor: keyof typeof colorPalette;
  }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name={iconName} size={normalize(26)} color={colorPalette[iconColor]} />
        <View style={{ marginLeft: 12 }}>
          <Typography style={{ fontSize: 16 }}>{text}</Typography>
          {subText && <Typography style={{ fontSize: 12, color: 'gray' }}>{subText}</Typography>}
        </View>
      </View>
    );
  };
  async function presentPaywall(): Promise<boolean> {
    // Present paywall for current offering:
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();
    const offerings = await Payments.getOfferings();
    // // or if you need to present a specific offering:
    // const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
    //   offering: offering, // Optional Offering object obtained through getOfferings
    // });

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
        console.log('Error presenting paywall');
        break;
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
    return true;
  }
  useEffect(() => {
    presentPaywall();
  }, []);
  const { t } = useTranslation();
  const [widget, setWidget] = useState('');
  const navigation = useNavigation();
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        withBackButton={true}
        style={commonStyles.baseScreenPadding}
        title={t('common.monetization')}
      ></ScreenHeader>
      <Flex gap={12} style={[styles.generalContainer, commonStyles.baseScreenPadding]}>
        <Flex gap={2}>
          <Typography style={styles.subtitle} size='default'>
            {t('settings.monetizationInfo')}
          </Typography>
        </Flex>

        <Flex gap={12} style={[styles.generalContainer]}>
          <IoniconText
            text={'Subscribed to Chatter Pro'}
            subText={'Completed'}
            iconName={'checkmark-circle'}
            iconColor={'primary500'}
          />
          <IoniconText
            text={'Completed Payout Onboarding'}
            subText={'Pending'}
            iconName={'checkmark-circle'}
            iconColor={'warning500'}
          />
        </Flex>

        <Button
          text='Complete Payout Onboarding'
          onPress={() => {
            navigation.navigate('PayoutWidget');
          }}
        />
      </Flex>
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

export default memo(Monetization);
