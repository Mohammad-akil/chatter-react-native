export interface ContentTypes {
  id?: string;
  media: string;
  captions: string;
  user: {
    name: string;
    avatar: string | null;
  };
}
