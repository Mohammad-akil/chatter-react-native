import { UserProfile } from '~/entities/User';

export type GetProfileResponse = {
  user: UserProfile;
  metadata: {
    is_following: boolean;
  };
};
