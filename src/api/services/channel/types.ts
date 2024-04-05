import { ChannelProfile } from '~/entities/Channel';

export type GetChannelResponse = {
  channel: ChannelProfile;
  metadata: {
    is_following: boolean;
  };
};
