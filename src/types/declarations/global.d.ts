import { RootStackParamList } from '../../navigation/types/RootStackParamList';
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }

  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};
}

export {};
