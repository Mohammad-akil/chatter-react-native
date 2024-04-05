import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native';
import ScreenHeader from '~/components/ScreenHeader';
import { commonStyles } from '~/styles';
import { WebView } from 'react-native-webview';
import { api } from '~/api';

const PayoutWidget = () => {
  const { t } = useTranslation();
  const [widget, setWidget] = useState('');
  useEffect(() => {
    async function fetchWidget() {
      const widget = await api.monetization.getWidget();
      console.log(widget);
      setWidget(widget.widgetLink);
    }
    fetchWidget();
  }, []);
  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      <ScreenHeader
        withBackButton={true}
        style={commonStyles.baseScreenPadding}
        title={t('common.monetization')}
      ></ScreenHeader>
      {widget && <WebView source={{ uri: widget }} style={{ flex: 1, backgroundColor: '#0C0A07' }} />}
    </SafeAreaView>
  );
};

export default memo(PayoutWidget);
