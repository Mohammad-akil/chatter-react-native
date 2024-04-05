import { type FC, memo } from 'react';
import { StyleSheet } from 'react-native';
import { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import OTPInputView from '@twotalltotems/react-native-otp-input';

import Typography from '~/ui/Typography';
import { AnimatedFlex } from '~/ui/Flex';

import { normalize } from '~/utils/normalize';
import { fonts } from '~/styles/fonts';
import { colorPalette } from '~/styles/colors';

export type OtpInputProps = {
  pinCount?: number;
  autoFocusOnLoad?: boolean;
  label?: string;
  onFill?: (code: string) => void;
  onChange?: (code: string) => void;
};

const OtpInput: FC<OtpInputProps> = ({ pinCount = 4, autoFocusOnLoad = true, onFill, onChange, label }) => {
  return (
    <AnimatedFlex
      layout={LinearTransition.duration(300)}
      entering={FadeIn}
      exiting={FadeOut}
      gap={12}
      style={styles.base}
    >
      {label && (
        <Typography type='body' size='medium' color='white'>
          {label}
        </Typography>
      )}
      <OTPInputView
        pinCount={pinCount}
        onCodeChanged={onChange}
        onCodeFilled={onFill}
        autoFocusOnLoad={autoFocusOnLoad}
        selectionColor={colorPalette.white}
        style={styles.container}
        codeInputFieldStyle={styles.input}
      />
    </AnimatedFlex>
  );
};

export default memo(OtpInput);

const styles = StyleSheet.create({
  base: {
    height: normalize(116),
  },
  container: {
    height: normalize(73),
  },
  input: {
    width: normalize(73),
    height: normalize(73),
    borderWidth: 0.5,
    borderRadius: normalize(37),
    fontSize: normalize(20),
    fontFamily: fonts.lato.bold,
  },
});
