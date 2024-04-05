import { memo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';

import Typography from '~/ui/Typography';
import { ControlledTextInput } from '~/ui/TextInput';

import { normalize } from '~/utils/normalize';
import { commonStyles } from '~/styles';
import FastImage from 'react-native-fast-image';
import Flex from '~/ui/Flex';
import { ControlledTextArea } from '~/ui/TextArea';
import { colorPalette } from '~/styles/colors';

const DetailsStep = () => {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const [monetizeChannel, setMonetizeChannel] = useState<boolean>();
  const [channelCounter, setChannelCounter] = useState<number>(2);
  const imageStyle = { width: width - normalize(40), height: normalize(205) };
  return (
    <ScrollView scrollEnabled={true} contentContainerStyle={styles.contentContainer}>
      <Typography type='body' size='medium' color='textSecondary'>
        {t('createChannel.detailsDescription')}
      </Typography>
      <Flex justifyContent='center'>
        <FastImage source={require('~/assets/images/create-new-channel.png')} style={imageStyle} />
      </Flex>
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={normalize(Platform.OS === 'ios' ? 150 : 0)}
        style={styles.content}
      >
        <Flex gap={40}>
          <ControlledTextInput
            placeholder={t('common.enterName')}
            label={t('createChannel.channelName')}
            withBorder
            name='name'
          />
          <ControlledTextArea
            placeholder={t('common.addDescription')}
            label={t('common.description')}
            name='description'
            withoutBorder
          />
          <Flex flexDirection='row' justifyContent='space-between'>
            <Flex gap={2} style={styles.monetizeContainer}>
              <Typography type='label' size='medium'>
                {t('common.monetizeChannel')}
              </Typography>
              <Typography type='label' size='small' color='primary400'>
                {channelCounter}/3{t('common.availableChannels')}
              </Typography>
              <Typography type='label' size='small' color='grey300'>
                {t('common.youCanEnable')}
              </Typography>
            </Flex>
            <Flex justifyContent='center'>
              <Switch
                trackColor={{ false: colorPalette.grey100, true: colorPalette.primary600 }}
                onValueChange={setMonetizeChannel}
                value={monetizeChannel}
              />
            </Flex>
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default memo(DetailsStep);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    gap: normalize(24),
    ...commonStyles.baseScreenPadding,
  },
  content: {
    flex: 1,
    gap: normalize(24),
  },
  monetizeContainer: { maxWidth: '60%' },
});
