import { type FC, memo, useCallback, useState } from 'react';
import { type StyleProp, type ViewStyle, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Flex from '~/ui/Flex';
import IconButton from '~/ui/IconButton';

import { colorPalette } from '~/styles/colors';
import { useRecoilState } from 'recoil';
import { sharePopupState } from '~/state';

type ProfileHeaderProps = {
  style?: StyleProp<ViewStyle>;
  view?: 'preview' | 'owner';
  user: any;
};

const ProfileHeader: FC<ProfileHeaderProps> = ({ style, view = 'preview', user }) => {
  const headerStyles = [styles.base, style];
  const { navigate, goBack } = useNavigation();

  const justifyContent = view === 'preview' ? 'space-between' : 'flex-end';

  const goToSettings = useCallback(() => {
    navigate('Settings');
  }, [navigate]);

  const goToEditProfile = useCallback(() => {
    navigate('EditProfile');
  }, [navigate]);

  const [share, setShare] = useRecoilState(sharePopupState);

  return (
    <View>
      <Flex style={headerStyles} justifyContent={justifyContent} flexDirection='row'>
        {view === 'preview' && <IconButton iconName='close-outline' size='xl' type='secondary' onPress={goBack} />}
        <Flex gap={12} flexDirection='row'>
          <IconButton iconName='ellipsis-horizontal' size='xl' type='text' />
          <IconButton
            iconName='share-outline'
            size='xl'
            type='text'
            onPress={() => {
              setShare({ open: true, title: 'Share', url: `https://chattersocial.io/profile/${user.id}` });
            }}
          />
          {view === 'owner' && (
            <>
              <IconButton iconName='cash' size='xl' type='secondary' />
              <IconButton onPress={goToSettings} iconName='cog-outline' size='xl' type='secondary' />
              <IconButton iconName='pencil' size='xl' type='secondary' onPress={goToEditProfile} />
            </>
          )}
        </Flex>
      </Flex>
    </View>
  );
};

export default memo(ProfileHeader);

const styles = StyleSheet.create({
  base: {
    backgroundColor: colorPalette.grey850,
  },
});
