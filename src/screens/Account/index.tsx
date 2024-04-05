import React, { useState } from 'react';
import { Image, View } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Button from '~/ui/Button';

function Account() {
  const [img, setImg] = useState('');
  async function openImageGallery() {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
    }).then((image) => {
      const { path } = image;
      setImg(path);
    });
  }
  return (
    <View style={{ padding: 20 }}>
      <Image
        style={{ marginVertical: 20, width: 100, height: 100 }}
        source={{
          uri: img,
        }}
      />
      <Button text='Change Profile PFP' onPress={openImageGallery} />
    </View>
  );
}

export default Account;
