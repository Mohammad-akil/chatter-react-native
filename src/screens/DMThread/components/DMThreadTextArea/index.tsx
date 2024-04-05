import { Dispatch, FC, SetStateAction, memo, useCallback } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TextInput } from '~/ui/TextInput';

import { normalize } from '~/utils/normalize';
import { colorPalette } from '~/styles/colors';

interface IDMThreadTextArea {
  setTextInputValue: Dispatch<SetStateAction<string>>;
  setIsInputFocused: Dispatch<SetStateAction<boolean>>;
  textInputValue: string;
}

const DMThreadTextArea: FC<IDMThreadTextArea> = ({ setTextInputValue, textInputValue, setIsInputFocused }) => {
  const { t } = useTranslation();
  const changeText = useCallback(
    (text: string) => {
      setTextInputValue(text);
    },
    [setTextInputValue],
  );
  const onFocusHandle = useCallback(() => {
    setIsInputFocused(true);
  }, [setIsInputFocused]);

  const onBlurHandle = useCallback(() => {
    setIsInputFocused(false);
  }, [setIsInputFocused]);

  const input = !textInputValue ? { width: '65%' } : { width: '100%' };
  return (
    <TextInput
      value={textInputValue}
      onChangeText={changeText}
      placeholder={t('common.message')}
      multiline
      onFocus={onFocusHandle}
      onBlur={onBlurHandle}
      placeholderTextColor={colorPalette.grey50}
      containerStyle={[styles.inputContainer, input as ViewStyle]}
      style={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: normalize(16),
    maxHeight: normalize(100),
  },
  input: {
    fontSize: normalize(14),
    lineHeight: normalize(16),
    paddingBottom: 0,
    justifyContent: 'center',
    paddingTop: 0,
  },
});
export default memo(DMThreadTextArea);
