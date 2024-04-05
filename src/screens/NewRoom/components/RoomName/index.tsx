import { FC, memo, useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useRecoilState } from 'recoil';

import { TextInput } from '~/ui/TextInput';
import Typography from '~/ui/Typography';
import { AnimatedFlex } from '~/ui/Flex';

import { roomNameError, roomNameValidator, roomState } from '../../state';
import { useTranslation } from 'react-i18next';

type RoomNameProps = {
  style?: StyleProp<ViewStyle>;
  edit: boolean;
};

export const RoomName: FC<RoomNameProps> = memo(({ style, edit = false }) => {
  const { t } = useTranslation();
  const [roomData, setRoomData] = useRecoilState(roomState);
  const [invalidName, setInvalidName] = useRecoilState(roomNameError);

  const handleChangeName = useCallback(
    (text: string) => {
      const isValid = roomNameValidator.safeParse(text);

      if (isValid.success) {
        setInvalidName((prev) => {
          return {
            ...prev,
            message: null,
          };
        });
      } else {
        setInvalidName((prev) => {
          return {
            ...prev,
            message: isValid.error.errors[0].message,
          };
        });
      }

      setRoomData((current) => {
        return {
          ...current,
          name: text,
        };
      });
    },
    [setRoomData, setInvalidName],
  );

  if (!edit) {
    return (
      <AnimatedFlex style={style} gap={4}>
        <Typography type='headline' size='medium'>
          {roomData.name}
        </Typography>
      </AnimatedFlex>
    );
  }

  return (
    <AnimatedFlex style={style} gap={4}>
      <Typography type='label' size='medium'>
        {t('room.giveYourRoomATitle')}
      </Typography>
      <TextInput
        placeholder={t('room.roomTitle')}
        error={invalidName.triggered ? invalidName.message! : undefined}
        withBorder={invalidName.triggered}
        inputTypographyType='headline'
        inputTypographySize='medium'
        value={roomData.name}
        autoFocus
        onChangeText={handleChangeName}
      />
    </AnimatedFlex>
  );
});
