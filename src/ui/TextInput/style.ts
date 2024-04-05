import { StyleSheet } from 'react-native';

import { colors } from '~/styles/colors';
import { typography } from '~/styles/typography';
import { normalize } from '~/utils/normalize';

const inputContainer = StyleSheet.create({
  base: {
    justifyContent: 'center',
  },
});

const inputStyles = StyleSheet.create({
  base: {
    paddingVertical: normalize(12),
    color: colors.text.textDefault,
  },
  disabled: {
    color: colors.text.textInputDisabled,
  },
});

const borderStyles = StyleSheet.create({
  base: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.borderPrimary,
  },
  focused: {
    borderBottomColor: colors.border.borderFocused,
  },
  error: {
    borderBottomColor: colors.border.borderError,
  },
  disabled: {
    borderBottomColor: colors.border.borderDisabled,
  },
});

const labelStyles = StyleSheet.create({
  base: {
    color: colors.text.textLabel,
    ...typography.label.medium,
  },
});

const hintStyles = StyleSheet.create({
  base: {
    paddingVertical: 2,
    ...typography.body.small,
  },
  error: {
    color: colors.text.textError,
  },
  disabled: {
    color: colors.text.textSecondary,
  },
});

const iconStyles = StyleSheet.create({
  base: {
    position: 'absolute',
    right: 0,
    // top: 8,
    zIndex: 2,
  },
});

export const styles = {
  inputContainer: { ...inputContainer },
  input: { ...inputStyles },
  border: { ...borderStyles },
  label: { ...labelStyles },
  hint: { ...hintStyles },
  icon: { ...iconStyles },
};
