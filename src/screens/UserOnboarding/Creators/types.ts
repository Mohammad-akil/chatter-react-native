import type { z } from 'zod';
import type { creatorsValidationSchema } from './validation';

export type CreatorsForm = z.infer<typeof creatorsValidationSchema>;

export type CreatorCategory = {
  id: string;
  title: string;
  creators: Creator[];
};

export type Creator = {
  id: string;
  image: string;
  name: string;
  username: string;
  followers: string;
};
