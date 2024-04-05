import { Message } from '~/entities/DirectMessages';

export interface IMessage {
  item: Message;
  prevMessage: Message;
  paddingAnotherUser: {
    paddingTop: number;
  } | null;
  gifStyle:
    | {
        aspectRatio: number;
        width: string;
        height: string;
        borderRadius: number;
      }
    | {
        aspectRatio?: undefined;
        width?: undefined;
        height?: undefined;
        borderRadius?: undefined;
      };
  imageMessageStyle:
    | {
        borderRadius: number;
        backgroundColor: '#2D94C1';
        paddingVertical?: undefined;
        paddingHorizontal?: undefined;
      }
    | {
        paddingVertical: number;
        paddingHorizontal: number;
        borderRadius: number;
        backgroundColor: '#2D94C1';
      };
  imageGeneralStyles: {
    maxWidth: number;
  };
  imageUri?: string;
}
