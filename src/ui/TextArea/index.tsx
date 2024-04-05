import { useState, type FC, useCallback, memo, useMemo } from 'react';
import {
  type TextInputFocusEventData,
  type NativeSyntheticEvent,
  type StyleProp,
  type TextStyle,
  View,
  TextInput as RNTextInput,
  TextInputContentSizeChangeEventData,
  Text,
} from 'react-native';
import { useController, useFormContext } from 'react-hook-form';

import { colors } from '~/styles/colors';
import { styles } from './style';
import { ControlledTextAreaProps, TextAreaProps } from './types';
import { normalize } from '~/utils/normalize';
import Typography from '../Typography';

export const TextArea: FC<TextAreaProps> = memo(
  ({
    style,
    label,
    defaultHeight = 50,
    maxLength,
    maxHeight,
    editable = true,
    onFocus,
    withoutBorder,
    onBlur,
    onChangeText,
    ...props
  }) => {
    const [charactersLength, setCharactersLength] = useState(0);
    const [height, setHeight] = useState(defaultHeight);
    const [focused, setFocused] = useState(false);

    const textAreaStyles: StyleProp<TextStyle> = useMemo(() => {
      return [
        { height: normalize(height) },
        styles.textArea.base,
        styles.textArea.textFont,
        !editable && styles.textArea['disabled'],
        (withoutBorder && styles.border.withoutBorder) || styles.border.base,
        focused && styles.border['focused'],
        !editable && styles.border['disabled'],
      ];
    }, [height, focused, editable, withoutBorder]);

    const characterCountStyles: StyleProp<TextStyle> = useMemo(() => {
      return [styles.characterCount.base, !editable && styles.characterCount['disabled']];
    }, [editable]);

    const handleContentSizeChange = useCallback(
      (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        const inputHeight = e.nativeEvent.contentSize.height;

        if (inputHeight < defaultHeight) {
          return;
        }
        if (maxHeight && maxHeight < inputHeight) {
          return setHeight(maxHeight);
        }

        setHeight(inputHeight);
      },
      [maxHeight, defaultHeight],
    );

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

    const _onChangeText = useCallback(
      (text: string) => {
        maxLength && setCharactersLength(text.length);
        onChangeText && onChangeText(text);
      },
      [onChangeText, maxLength],
    );

    return (
      <View style={style}>
        {label && (
          <Typography style={styles.textArea.label} type='label' size='medium' color='textLabel'>
            {label}
          </Typography>
        )}
        <RNTextInput
          style={textAreaStyles}
          multiline
          onContentSizeChange={handleContentSizeChange}
          placeholderTextColor={colors.text.textInputDisabled}
          selectionColor={colors.text.textDefault}
          editable={editable}
          onFocus={_onFocus}
          onBlur={_onBlur}
          onChangeText={_onChangeText}
          maxLength={maxLength}
          {...props}
        />
        {maxLength && (
          <Text style={characterCountStyles}>
            {charactersLength} / {maxLength}
          </Text>
        )}
      </View>
    );
  },
);

export const ControlledTextArea: FC<ControlledTextAreaProps> = memo(({ name, ...props }) => {
  const formContext = useFormContext();
  const { field } = useController({
    name,
    control: formContext.control,
  });

  const { onChange, onBlur, value } = field;
  const handleChange = useCallback((value: string) => onChange({ target: { value, name } }), [name, onChange]);

  return <TextArea onChangeText={handleChange} onBlur={onBlur} value={value} {...props} />;
});
