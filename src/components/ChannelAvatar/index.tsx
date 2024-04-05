import { launchImageLibrary } from 'react-native-image-picker';
import { View } from 'react-native';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import type { ChannelAvatarProps } from './types';
import Avatar from '~/ui/Avatar';
// import Button from '../Button';
import { commonStyles } from '../../styles';

const ChannelAvatar: FC<ChannelAvatarProps> = ({ isEdit, fieldName }) => {
  const avatar = useWatch({ name: fieldName });
  const { setValue } = useFormContext();

  const handleUpload = useCallback(async () => {
    const { assets } = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (!assets?.length) {
      return;
    }

    const [image] = assets;

    setValue(fieldName, image.uri);
  }, [setValue, fieldName]);

  const handleClear = useCallback(() => {
    setValue(fieldName, null);
  }, [setValue, fieldName]);

  return (
    <View style={styles.wrapper}>
      <Avatar url={avatar} size={80} borderRadius='minimal' />
      {isEdit && (
        <>
          {/* <Button
            buttonStyle={commonStyles.defaultButton}
            titleStyle={commonStyles.defaultButtonTitle}
            title='Upload avatar'
            iconPosition='right'
            onPress={handleUpload}
            icon={<Icon name='cloud-upload' color='white' size={20} style={commonStyles.rightIcon} />}
          />
          <Button
            buttonStyle={commonStyles.dangerButton}
            titleStyle={commonStyles.dangerButtonTitle}
            title='Clear'
            iconPosition='right'
            onPress={handleClear}
            icon={<Icon name='trash' color='#ED675F' size={20} style={commonStyles.rightIcon} />}
          /> */}
        </>
      )}
    </View>
  );
};

export default ChannelAvatar;
