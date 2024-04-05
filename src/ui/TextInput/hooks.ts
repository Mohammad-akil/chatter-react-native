import { useCallback, useMemo, useState } from 'react';
import { StyleProp, TextStyle } from 'react-native';

import type { UseTextInputStylesProps } from './types';
import { styles } from './style';
import { typography } from '~/styles/typography';

export const useSecuredVisibility = (secureTextEntry: boolean) => {
  const [showText, setShowText] = useState(!secureTextEntry);

  const toggleVisibility = useCallback(() => {
    setShowText((prev) => !prev);
  }, []);

  const iconName = useMemo(() => {
    return showText ? 'eye-outline' : 'eye-off-outline';
  }, [showText]);

  return {
    iconName,
    showText,
    toggleVisibility,
  };
};

export const useTextInputStyles = ({
  focused,
  error,
  editable,
  withBorder,
  inputTypographyType = 'label',
  inputTypographySize = 'medium',
  style,
}: UseTextInputStylesProps) => {
  const inputStyles = useMemo(() => {
    return [
      styles.input.base,
      //@ts-ignore
      typography[inputTypographyType][inputTypographySize],
      { lineHeight: undefined },
      !editable && styles.input['disabled'],
    ];
  }, [editable, inputTypographySize, inputTypographyType]);

  const borderStyles = useMemo(() => {
    return [
      styles.border.base,
      focused && styles.border['focused'],
      Boolean(error) && styles.border['error'],
      !editable && styles.border['disabled'],
    ];
  }, [focused, error, editable]);

  const textInputStyles = useMemo(() => {
    const styles: StyleProp<TextStyle> = [...inputStyles, style];
    if (withBorder) {
      styles.push(...borderStyles);
    }
    return styles;
  }, [inputStyles, borderStyles, withBorder, style]);

  const hintStyles = useMemo(() => {
    return [styles.hint.base, Boolean(error) && styles.hint['error'], !editable && styles.hint['disabled']];
  }, [error, editable]);

  return {
    inputContainer: styles.inputContainer.base,
    inputStyles: textInputStyles,
    labelStyles: styles.label.base,
    hintStyles: hintStyles,
    iconStyles: styles.icon.base,
  };
};
