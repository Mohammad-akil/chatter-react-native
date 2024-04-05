import { type FC, memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import { ControlledTextInput, TextInput } from '~/ui/TextInput';
import { ControlledTextInputProps, TextInputProps } from '~/ui/TextInput/types';
import { normalize } from '~/utils/normalize';
import { colors } from '~/styles/colors';

import { styles } from './styles';

type SearchInputProps = {
  style?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, 'containerStyle'>;

type ControlledSearchInputProps = {
  style?: StyleProp<ViewStyle>;
} & Omit<ControlledTextInputProps, 'containerStyle'>;

export const SearchInput: FC<SearchInputProps> = memo(({ placeholder, style, ...props }) => {
  const { t } = useTranslation();
  const wrapperStyles = [styles.inputWrapper, style];
  return (
    <View style={wrapperStyles}>
      <Icon style={styles.searchIcon} name='search-outline' size={normalize(20)} color={colors.text.textDefault} />
      <TextInput {...props} placeholder={placeholder || t('common.search')} containerStyle={styles.inputContainer} />
    </View>
  );
});

export const ControlledSearchInput: FC<ControlledSearchInputProps> = memo(({ style, ...props }) => {
  const { t } = useTranslation();
  const wrapperStyles = [styles.inputWrapper, style];
  return (
    <View style={wrapperStyles}>
      <Icon style={styles.searchIcon} name='search-outline' size={normalize(20)} color={colors.text.textDefault} />
      <ControlledTextInput {...props} placeholder={t('common.search')} containerStyle={styles.inputContainer} />
    </View>
  );
});
