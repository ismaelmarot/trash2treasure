import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './translations/es.json'
import en from './translations/en.json'

const resources = {
  es: { translation: es },
  en: { translation: en }
}

// Detectar idioma del navegador
const getBrowserLanguage = () => {
  const savedLang = localStorage.getItem('language')
  if (savedLang && ['es', 'en'].includes(savedLang)) {
    return savedLang
  }
  
  const browserLang = navigator.language.split('-')[0]
  if (['es', 'en'].includes(browserLang)) {
    return browserLang
  }
  
  return 'en' // default
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getBrowserLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

// Guardar idioma cuando cambia
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n
