import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import ru from './locales/ru.json';
import ro from './locales/ro.json';

const resources = {
  fr: { translation: fr },
  ru: { translation: ru },
  ro: { translation: ro },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
