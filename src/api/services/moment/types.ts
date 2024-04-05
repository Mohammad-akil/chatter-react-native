export type CreateMomentPayload = {
  room_id: string;
  start: number;
  end: number;
  title: string;
};

export type GenerateAudioResponse = {
  audio_url: string;
  duration: number;
  captions: any[] | null;
  program_start_time: number;
  program_end_time: number;
};
