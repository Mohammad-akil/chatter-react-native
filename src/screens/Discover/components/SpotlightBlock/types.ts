import { ViewStyle } from 'react-native';

export type SpotLightBlockProps = {
  id: number;
  name: string;
  description: string;
  date: string;
  author: { id: number; name: string; avatar: string };
  category: { id: number; name: string; subCategory: string };
  added: boolean;
  style?: ViewStyle | ViewStyle[];
};
