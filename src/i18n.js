import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Namespace'leri şimdilik boş objelerle başlatıyoruz
// Çeviri dosyaları oluştukça buraya import edilecekler
import commonTr from './locales/tr/common.json';
import loginTr from './locales/tr/login.json';
import homeTr from './locales/tr/home.json';
import appointmentTr from './locales/tr/appointment.json';
import kurumsalTr from './locales/tr/kurumsal.json';
import medicalTr from './locales/tr/medical.json';
import authTr from './locales/tr/auth.json';
import contactTr from './locales/tr/contact.json';
import footerTr from './locales/tr/footer.json';
import legalTr from './locales/tr/legal.json';

import commonEn from './locales/en/common.json';
import loginEn from './locales/en/login.json';
import homeEn from './locales/en/home.json';
import appointmentEn from './locales/en/appointment.json';
import kurumsalEn from './locales/en/kurumsal.json';
import medicalEn from './locales/en/medical.json';
import authEn from './locales/en/auth.json';
import contactEn from './locales/en/contact.json';
import footerEn from './locales/en/footer.json';
import legalEn from './locales/en/legal.json';

const resources = {
    tr: {
        common: commonTr,
        login: loginTr,
        home: homeTr,
        appointment: appointmentTr,
        kurumsal: kurumsalTr,
        medical: medicalTr,
        auth: authTr,
        contact: contactTr,
        footer: footerTr,
        legal: legalTr
    },
    en: {
        common: commonEn,
        login: loginEn,
        home: homeEn,
        appointment: appointmentEn,
        kurumsal: kurumsalEn,
        medical: medicalEn,
        auth: authEn,
        contact: contactEn,
        footer: footerEn,
        legal: legalEn
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'tr',
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        ns: ['common', 'login', 'home', 'appointment', 'kurumsal', 'medical', 'auth', 'contact', 'footer', 'legal'],
        defaultNS: 'common'
    });

export default i18n;
