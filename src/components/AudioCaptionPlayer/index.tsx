import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AudioRecorderPlayer, { PlayBackType } from 'react-native-audio-recorder-player';
import Typography from '~/ui/Typography';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Avatar from '~/ui/Avatar';
import { normalize } from '~/utils/normalize';
import { AnimatedFlex } from '~/ui/Flex';
import { ContentTypes } from '~/screens/Conversation/screens/ConversationView/types';
import { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

const playerInstance = new AudioRecorderPlayer();

function AudioCaptionPlayer({
  content,
  onDone,
  autoplay = true,
}: {
  content: ContentTypes;
  onDone: any;
  autoplay?: boolean;
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const player = useMemo(() => {
    playerInstance.setSubscriptionDuration(0.08);
    return playerInstance;
  }, []);
  const [transcript, setTranscript] = useState<any>();

  useEffect(() => {
    async function reload() {
      setTranscript(undefined);
      await playerInstance.stopPlayer();

      await playerInstance.startPlayer(content.media);
    }
    reload();
  }, [content]);

  const timeCallback = useCallback(
    (playbackMeta: PlayBackType) => {
      const seconds = playbackMeta.currentPosition / 1000;
      if (playbackMeta.currentPosition == playbackMeta.duration && !isFinished) {
        setIsFinished(true);
        onDone(content.id);
      } else {
        setIsFinished(false);
      }
      setCurrentTime(Number(seconds.toFixed(4)));
    },
    [onDone, isFinished, content.id],
  );

  useEffect(() => {
    playerInstance.addPlayBackListener(timeCallback);
  }, [timeCallback]);

  useEffect(() => {
    async function load() {
      const result = await axios.get(content.captions);
      setTranscript(result.data);

      playerInstance.startPlayer(content.media);
    }

    if (currentTime === 0) load();
  }, [autoplay, content.captions, content.media, currentTime]);

  useEffect(() => {
    return () => {
      playerInstance.stopPlayer();
    };
  }, []);

  const [currentText, setCurrentText] = useState<React.JSX.Element>();
  const [currentCaptionItem, setCurrentCaptionItem] = useState(0);

  useEffect(() => {
    if (transcript) {
      const transcriptItem = transcript?.utterances.find((item: any) => {
        return currentTime >= item.start && currentTime <= item.end;
      });
      if (transcriptItem) {
        const index = transcript.utterances.indexOf(transcriptItem as any);
        setCurrentCaptionItem(index);
        const textWithBoldWord = transcriptItem.words.map((word: any, index: any) => {
          if (currentTime >= word.start && currentTime <= word.end) {
            return (
              <Text key={index} style={{ fontSize: 16, color: '#00ced1', zIndex: 2 }}>
                {word.text + ' '}
              </Text>
            );
          } else {
            return word.text + ' ';
          }
        });
        setCurrentText(<Text style={{ fontSize: 16, color: 'white', zIndex: 2 }}>{textWithBoldWord}</Text>);
      } else {
        if (currentCaptionItem + 1 < transcript.utterances.length) {
          setCurrentText(
            <Text style={{ fontSize: 16, color: 'white', zIndex: 2 }}>
              {transcript.utterances[currentCaptionItem + 1].transcript}
            </Text>,
          );
        } else {
          setCurrentText(
            <Text style={{ fontSize: 16, color: 'white', zIndex: 2 }}>
              {transcript?.utterances[currentCaptionItem]?.transcript}
            </Text>,
          );
        }
      }
    }
  }, [currentTime, transcript, currentCaptionItem, player]);

  return (
    <>
      {!!transcript?.utterances?.length && !!transcript && (
        <AnimatedFlex
          entering={FadeIn}
          exiting={FadeOut}
          layout={LinearTransition.duration(100)}
          style={{ paddingHorizontal: normalize(12) }}
        >
          <LinearGradient
            useAngle={true}
            angle={90}
            colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.008)']}
            style={styles.linearGradient}
            angleCenter={{ x: 0.5, y: 0.5 }}
          >
            {content.user ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 4 }}>
                <Avatar size={24} url={content.user.avatar} />
                <Typography style={{ fontSize: 14, marginLeft: 10 }}>{content.user.name}</Typography>
              </View>
            ) : null}
            {currentText}
          </LinearGradient>
        </AnimatedFlex>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    margin: 0,
    padding: 12,
  },
});

export default AudioCaptionPlayer;
