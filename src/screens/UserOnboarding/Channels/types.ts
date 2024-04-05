import type { z } from 'zod';
import type { channelsValidationSchema } from './validation';

export type ChannelsForm = z.infer<typeof channelsValidationSchema>;

export type ChannelCategory = {
  id: string;
  name: string;
  channels: Channel[];
};

export type Channel = {
  id: string;
  title: string;
  author: string;
  image: string;
};
