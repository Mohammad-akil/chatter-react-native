import { type FC, memo, useCallback, useMemo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useRecoilState } from 'recoil';
import Flex from '~/ui/Flex';

import { colorPalette } from '~/styles/colors';
import { roomState } from '../../state';

type RoomDatePickerProps = {
  style?: StyleProp<ViewStyle>;
};

const RoomDatePicker: FC<RoomDatePickerProps> = ({ style }) => {
  const [roomData, setRoomData] = useRecoilState(roomState);

  const scheduledDate = useMemo(() => {
    return roomData.started_at ? new Date(Date.parse(roomData.started_at)) : new Date();
  }, [roomData.started_at]);

  const handleChangeDate = useCallback(
    (date: Date) => {
      setRoomData((prev) => {
        return {
          ...prev,
          started_at: date.toISOString(),
        };
      });
    },
    [setRoomData],
  );

  return (
    <Flex style={style} alignItems='center'>
      <DatePicker
        date={scheduledDate}
        minimumDate={new Date()}
        textColor='white'
        mode='datetime'
        locale={'en'}
        dividerHeight={1}
        androidVariant='iosClone'
        fadeToColor={colorPalette.grey850}
        is24hourSource='locale'
        onDateChange={handleChangeDate}
      />
    </Flex>
  );
};

export default memo(RoomDatePicker);
