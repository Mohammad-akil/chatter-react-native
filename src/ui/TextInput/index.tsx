import { type FC, memo, useCallback, useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from 'react-native';
import { useController, useFormContext } from 'react-hook-form';
import IconButton from '../IconButton';
import { colors } from '~/styles/colors';

import type { ControlledTextInputProps, TextInputProps } from './types';
import { useSecuredVisibility, useTextInputStyles } from './hooks';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const hitSlop = { left: 5, right: 5, bottom: 5, top: 5 };

export const TextInput: FC<TextInputProps> = memo(
  (
    {
      label,
      withBorder = false,
      hint,
      editable = true,
      bottomSheetInput = false,
      error,
      onFocus,
      onBlur,
      containerStyle,
      inputTypographyType = 'label',
      inputTypographySize = 'medium',
      secureTextEntry = false,
      style,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const { showText, iconName, toggleVisibility } = useSecuredVisibility(secureTextEntry);

    const { inputContainer, inputStyles, labelStyles, hintStyles, iconStyles } = useTextInputStyles({
      focused,
      error,
      editable,
      withBorder,
      inputTypographyType,
      inputTypographySize,
      style,
    });

    const _onFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(true);
        onFocus && onFocus(e);
      },
      [onFocus],
    );

    const _onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(false);
        onBlur && onBlur(e);
      },
      [onBlur],
    );

    const hintText = error ? error : hint;

    return (
      <View style={containerStyle}>
        {label && <Text style={labelStyles}>{label}</Text>}
        <View style={inputContainer}>
          {bottomSheetInput ? (
            <BottomSheetTextInput
              {...props}
              style={inputStyles}
              placeholderTextColor={colors.text.textInputDisabled}
              selectionColor={colors.text.textDefault}
              editable={editable}
              onFocus={_onFocus}
              onBlur={_onBlur}
              secureTextEntry={!showText}
            />
          ) : (
            <RNTextInput
              {...props}
              style={inputStyles}
              placeholderTextColor={colors.text.textInputDisabled}
              selectionColor={colors.text.textDefault}
              editable={editable}
              onFocus={_onFocus}
              onBlur={_onBlur}
              secureTextEntry={!showText}
              ref={ref}
            />
          )}

          {secureTextEntry && (
            <IconButton
              style={iconStyles}
              iconName={iconName}
              hitSlop={hitSlop}
              onPress={toggleVisibility}
              size='sm'
              type='text'
            />
          )}
        </View>
        {hintText && <Text style={hintStyles}>{hintText}</Text>}
      </View>
    );
  },
);

export const ControlledTextInput: FC<ControlledTextInputProps> = memo(({ name, ...props }) => {
  const formContext = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control: formContext.control,
  });

  const { onChange, onBlur, value } = field;
  const handleChange = useCallback((value: string) => onChange({ target: { value, name } }), [name, onChange]);

  return <TextInput {...props} onChangeText={handleChange} onBlur={onBlur} value={value} error={error?.message} />;
});
