import { t } from 'i18next';
import { Language } from '~/i18n/types';

export const getPrivacyOptions = (lang: Language) => {
  const options = {
    lng: lang,
  };

  return {
    open: {
      label: t('room.public', options),
      description: t('room.publicDescription', options),
    },
    private: {
      label: t('room.private', options),
      description: t('room.privateDescription', options),
    },
    subscribers: {
      label: t('room.social', options),
      description: t('room.socialDescription', options),
    },
  };
};
