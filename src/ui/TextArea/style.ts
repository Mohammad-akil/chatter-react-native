import { StyleSheet } from 'react-native';
import { colors } from '~/styles/colors';
import { typography } from '~/styles/typography';
import { normalize } from '~/utils/normalize';

const textAreaStyles = StyleSheet.create({
  base: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  label: {
    marginBottom: normalize(12),
  },
  textFont: {
    ...typography.body.default,
    color: colors.text.textDefault,
  },
  disabled: {
    color: colors.text.textInputDisabled,
  },
});

const borderStyles = StyleSheet.create({
  base: {
    borderWidth: 0.5,
    borderColor: colors.border.borderPrimary,
  },
  withoutBorder: {
    borderWidth: 0,
    paddingLeft: 0,
  },
  focused: {
    borderColor: colors.border.borderFocused,
  },
  disabled: {
    borderColor: colors.border.borderDisabled,
  },
});

const characterCountStyles = StyleSheet.create({
  base: {
    ...typography.body.small,
    color: colors.text.textSecondary,
    textAlign: 'right',
    marginRight: 6,
  },
  disabled: {
    color: colors.text.textInputDisabled,
  },
});

export const styles = {
  textArea: { ...textAreaStyles },
  border: { ...borderStyles },
  characterCount: { ...characterCountStyles },
};
