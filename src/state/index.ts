import { atom } from 'recoil';

export const sharePopupState = atom({
  key: 'isModalOpenState',
  default: {
    open: false,
    url: '',
    title: '',
  }, // Initial value is set to false
});
