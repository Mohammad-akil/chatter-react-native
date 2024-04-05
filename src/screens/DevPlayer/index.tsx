import React, { useEffect, useState } from 'react';
import AudioCaptionPlayer from '~/components/AudioCaptionPlayer';
import { SafeAreaView, View } from 'react-native';
import { commonStyles } from '~/styles';
import Typography from '~/ui/Typography';

function DevPlayer() {
  const [isDone, setIsDone] = useState(false);

  const [media, setMedia] = useState<string>('https://content.chattersocial.io/sample.mp3');

  const handleDone = (data: boolean) => {
    setIsDone(data);
  };

  useEffect(() => {
    setTimeout(() => {
      setMedia(
        'https://content.chattersocial.io/conversation/904de9d8-1a76-468e-ba28-2e41d3d868d0/d03a8da9-285d-47db-b084-7c9b9a5f0be5.aac',
      );
    }, 2000);
  }, [media]);

  return (
    <SafeAreaView style={commonStyles.baseSafeArea}>
      {/* <AudioCaptionPlayer
        content={{
          media:
            'https://content.chattersocial.io/conversation/e338739b-b67d-490d-aab1-7068b4fe003c/40ef2779-95e5-4dd9-a089-8b58310369e7.aac',
          captions:
            'https://content.chattersocial.io/conversation/e338739b-b67d-490d-aab1-7068b4fe003c/40ef2779-95e5-4dd9-a089-8b58310369e7.json',
          user: {
            name: 'Borat',
            avatar:
              'https://pyxis.nymag.com/v1/imgs/eff/6af/53f1f544d85d8bf72b8237885c6da4e6b2-15-borat-mankini-sacha-baron-cohen.rsquare.w400.jpg',
          },
        }}
        onDone={handleDone}
        autoplay={true}
      /> */}
    </SafeAreaView>
  );
}

export default DevPlayer;
