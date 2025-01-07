import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from '@/constants/locales/en.json';
import de from '@/constants/locales/de.json';
import AsyncStorage from "@react-native-async-storage/async-storage";

const initI18n = async () => {
    let savedLanguage: string | null = await AsyncStorage.getItem("language");

    if (!savedLanguage) {
        savedLanguage = Localization.getLocales()[0].languageCode;
    }

    i18n.use(initReactI18next).init({
        fallbackLng: 'en',
        lng: savedLanguage ?? undefined,
        resources: {
            en: { translation: en },
            de: { translation: de },
        },
        interpolation: {
            escapeValue: false,
        },
    });
};

initI18n();

export default i18n;