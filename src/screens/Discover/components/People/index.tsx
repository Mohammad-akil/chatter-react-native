import { memo, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { commonStyles } from '~/styles';
import Flex from '~/ui/Flex';
interface People {
  id: number;
  title: string;
  viewed: number;
  liked: number;
  previewVideo: string;
}
const People = () => {
  const { top, bottom } = useSafeAreaInsets();

  const scrollViewContentStyle = useMemo(() => {
    return [commonStyles.fullHeight, { paddingBottom: bottom, paddingTop: top }, commonStyles.baseScreenPadding];
  }, [top, bottom]);
  // const listContainerStyles: StyleProp<ViewStyle> = {
  //   paddingBottom: Platform.OS === 'android' ? normalize(130) : normalize(100),
  // };
  // const renderItem: ListRenderItem<User> = useCallback(({ item }) => {
  //   return (
  //     <ProfileItem
  //       style={{ justifyContent: 'flex-start' }}
  //       avatar={item.avatar}
  //       firstName={item.firstName}
  //       userName={item.username}
  //     />
  //   );
  // }, []);

  return (
    <Flex style={scrollViewContentStyle}>
      <Flex flex={1}>
        {/* <FlatList
          contentContainerStyle={listContainerStyles}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          data={users}
          renderItem={renderItem}
        /> */}
      </Flex>
    </Flex>
  );
};

export default memo(People);
