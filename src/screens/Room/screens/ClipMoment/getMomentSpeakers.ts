import { EventSnapshot, MomentSpeakingUser } from '~/entities/Moments';

export const getMomentSpeakers = (
  momentFrames: EventSnapshot[],
  startPosition: number,
  endPosition: number,
): MomentSpeakingUser[] => {
  const filteredSpeakers: MomentSpeakingUser[] = [];

  momentFrames.forEach((frame) => {
    if (frame.program_time >= startPosition && frame.program_time <= endPosition) {
      if (!frame.speaking) return;

      frame.speaking.forEach((user) => {
        if (filteredSpeakers.find((filteredUser) => filteredUser.id === user.id)) return;
        filteredSpeakers.push(user);
      });
    }
  });

  return filteredSpeakers;
};
