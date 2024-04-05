const config = {
  screens: {
    RoomNavigator: {
      path: 'room/:room_id',
    },
    PreviewProfile: {
      path: 'profile/:user_id',
    },
    DMThread: {
      path: 'dm/:chatId',
    },
  },
};

export const linkingConfig = {
  prefixes: ['chatter://app', 'https://chattersocial.io', 'https://www.chattersocial.io'],
  config,
};
