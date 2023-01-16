import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";


const loadPath = `https://api.i18nexus.com/project_resources/translations/{{lng}}/{{ns}}.json?api_key=${process.env.REACT_APP_LANGUAGE_API_KEY}`;
console.log(loadPath);
console.log(process.env.REACT_APP_LANGUAGE_API_KEY);

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",

    ns: ["default"],
    defaultNS: "default",

    supportedLngs: ["en","bn","hi","te","ta","ml","kn","mr","gu","pa","ne","ur"],
    
    backend: {
      loadPath: loadPath
    }
  })