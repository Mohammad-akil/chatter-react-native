import { memo, type FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';

import { colorPalette } from '~/styles/colors';
import { styles } from './styles';

type ImagePreviewProps = {
  uri: string;
  handleDelete?: () => void;
};

const ImagePreview: FC<ImagePreviewProps> = ({ uri, handleDelete }) => {
  return (
    <View style={styles.wrapper}>
      <FastImage resizeMode='contain' style={styles.previewImage} source={{ uri }}>
        <TouchableOpacity style={styles.remove} onPress={handleDelete}>
          <Icon name='close-circle' size={22} color={colorPalette.white} />
        </TouchableOpacity>
      </FastImage>
    </View>
  );
};

export default memo(ImagePreview);
