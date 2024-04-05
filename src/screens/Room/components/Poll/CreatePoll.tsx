import { type FC, memo, useCallback, useMemo } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet } from 'react-native';
import { LinearTransition } from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';

import { api } from '~/api';

import Flex, { AnimatedFlex } from '~/ui/Flex';
import { TextInput } from '~/ui/TextInput';
import BottomSheet from '~/ui/BottomSheet';
import Typography from '~/ui/Typography';
import IconButton from '~/ui/IconButton';
import Button from '~/ui/Button';

import { colors } from '~/styles/colors';
import { normalize } from '~/utils/normalize';

import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { state } from '../../state/roomState';
import { useRoomStore } from '../../hooks/useRoomStore';

type CreatePollProps = {
  style?: StyleProp<ViewStyle>;
};

const CreatePoll: FC<CreatePollProps> = () => {
  const { t } = useTranslation();
  const { clearCreatePollState } = useRoomStore();

  const roomDetails = useRecoilValue(state.roomDetailsState);
  const [createPollState, setCreatePollState] = useRecoilState(state.cretePollState);
  const [createPollPopupOpened, setCreatePollPopupOpened] = useRecoilState(state.createPollPopupOpenedState);
  const setRoomControlsOpened = useSetRecoilState(state.roomControlsOpenedState);

  const { question, options } = createPollState;

  const arrayOfOptions = useMemo(() => {
    return Array.from(options.values());
  }, [options]);

  const handleChangeTitle = useCallback(
    (text: string) => {
      setCreatePollState((prev) => {
        return {
          ...prev,
          question: text,
        };
      });
    },
    [setCreatePollState],
  );

  const createPoll = useCallback(async () => {
    console.log({ question, arrayOfOptions: arrayOfOptions.slice(0, -1) }); // LAST OPTION WILL ALWAYS CONTAIN EMPTY VALUE

    const options = arrayOfOptions
      .map((option) => {
        if (!option.text) {
          return undefined;
        }

        return {
          option: option.option,
          text: option.text!,
        };
      })
      .filter(Boolean);

    console.log(options);

    if (roomDetails?.id && question) {
      await api.room.createRoomPoll({
        room_id: roomDetails.id,
        question: question,
        //@ts-ignore
        options: options,
      });
    }

    setCreatePollPopupOpened(false);
    clearCreatePollState();
  }, [question, roomDetails, arrayOfOptions, setCreatePollPopupOpened, clearCreatePollState]);

  const showRoomControls = useCallback(() => {
    setRoomControlsOpened(true);
  }, [setRoomControlsOpened]);

  const closePopup = useCallback(() => {
    setCreatePollPopupOpened(false);
    setRoomControlsOpened(true);
    clearCreatePollState();
  }, [setCreatePollPopupOpened, clearCreatePollState, setRoomControlsOpened]);

  const createDisabled = useMemo(() => {
    const firstItem = options.get(1);
    const secondItem = options.get(2);
    return (
      !question ||
      !firstItem?.text ||
      !secondItem?.text ||
      question === '' ||
      firstItem?.text === '' ||
      secondItem?.text === ''
    );
  }, [question, options]);

  return (
    <BottomSheet
      open={createPollPopupOpened}
      setOpened={setCreatePollPopupOpened}
      style={styles.base}
      onDismiss={showRoomControls}
      backgroundStyle={styles.background}
    >
      <Flex style={styles.content} justifyContent='space-between' gap={16}>
        <Flex flexDirection='row' alignItems='center' justifyContent='space-between'>
          <Typography type='headline' size='small' color='white'>
            {t('room.newPoll')}
          </Typography>
          <IconButton type='text' iconName='close-outline' onPress={closePopup} />
        </Flex>
        <TextInput
          inputTypographyType='label'
          inputTypographySize='medium'
          bottomSheetInput
          label={t('common.title')}
          onChangeText={handleChangeTitle}
          withBorder
          placeholder={t('common.enterTitle')}
        />
        <Flex gap={4}>
          <Typography type='label' size='small' color='textSecondary'>
            {t('common.options')}
          </Typography>
          <ScrollView style={styles.optionsBlock} contentContainerStyle={styles.optionsBlockContent}>
            {arrayOfOptions.map((option, index) => {
              const lastElement = index === arrayOfOptions.length - 1;

              const changeText = (text: string) => {
                const copyMapOptions = options;
                const copyMapOption = options.get(option.option);

                const mapToSet = new Map<number, { option: number; text: string | null; placeholder: string }>();

                copyMapOptions.set(option.option, {
                  ...copyMapOption!,
                  text: text,
                });

                if (text === '' && index >= 1) {
                  const currentElement = index + 1;
                  copyMapOptions.forEach((v, k) => {
                    if (k <= currentElement) {
                      mapToSet.set(k, v);
                    }
                  });
                }

                if (lastElement && index <= 4) {
                  const idOfElementToCreate = index + 2;
                  copyMapOptions.set(idOfElementToCreate, {
                    option: index + 2,
                    text: null,
                    placeholder: `Option ${idOfElementToCreate}`,
                  });
                }

                setCreatePollState((prev) => {
                  return {
                    ...prev,
                    options: new Map(mapToSet.size > 0 ? mapToSet : copyMapOptions),
                  };
                });
              };

              return (
                <TextInput
                  key={option.option}
                  inputTypographyType='label'
                  inputTypographySize='medium'
                  bottomSheetInput
                  placeholder={option.placeholder}
                  onChangeText={changeText}
                />
              );
            })}
          </ScrollView>
        </Flex>
        <AnimatedFlex layout={LinearTransition.duration(200)}>
          <Button disabled={createDisabled} size='md' text={t('room.createPoll')} onPress={createPoll} />
        </AnimatedFlex>
      </Flex>
    </BottomSheet>
  );
};

export default memo(CreatePoll);

const styles = StyleSheet.create({
  base: {
    marginHorizontal: normalize(16),
  },
  background: {
    backgroundColor: colors.surface.surfaceComponent,
    marginBottom: 40,
  },
  optionsBlock: {
    maxHeight: 150,
  },
  optionsBlockContent: {
    gap: 2,
  },
  content: {
    padding: normalize(16),
  },
});
