import { FC, memo, useCallback } from 'react';
import { useRecoilState } from 'recoil';

import { TextArea } from '~/ui/TextArea';
import Typography from '~/ui/Typography';
import { roomState } from '../../state';

import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
import {
  Keyboard,
  NativeSyntheticEvent,
  StyleProp,
  TextInputKeyPressEventData,
  TextInputSubmitEditingEventData,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';

type RoomDescriptionProps = {
  style?: StyleProp<ViewStyle>;
};

export const RoomDescription: FC<RoomDescriptionProps> = memo(({ style }) => {
  const { t } = useTranslation();
  const [roomData, setRoomData] = useRecoilState(roomState);

  const handleChange = useCallback(
    (text: string) => {
      setRoomData((prev) => ({
        ...prev,
        description: text,
      }));
    },
    [setRoomData],
  );

  return (
    <Flex style={style} gap={8}>
      <Typography style={commonStyles.aeonikRegular} type='headline' size='small'>
        {t('common.whatIsARoomAbout')}
      </Typography>
      <TextArea
        placeholder={t('common.enterDescription')}
        value={roomData.description}
        onChangeText={handleChange}
        blurOnSubmit
        withoutBorder
      />
    </Flex>
  );
});
