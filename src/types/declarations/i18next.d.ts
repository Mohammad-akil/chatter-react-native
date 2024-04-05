import { Language, Translation } from '~/i18n/types';

declare module 'i18next' {
    interface CustomTypeOptions {
		defaultNS: 'en';
		resources: {
		  [language in Language]: Translation;
		};
	}
}
