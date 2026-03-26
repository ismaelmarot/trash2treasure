import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './translations/es.json'
import en from './translations/en.json'

const resources = {
  es: { translation: es },
  en: { translation: en }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // idioma default
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // React ya hace escaping
    }
  })

export default i18n
