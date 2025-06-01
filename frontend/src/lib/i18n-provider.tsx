'use client';

import { useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations from feature directories
import landingFr from '../features/landing/translations/fr';
import landingEn from '../features/landing/translations/en';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Create resources object inside useEffect to be reactive to changes
    const resources = {
      en: {
        landing: landingEn,
      },
      fr: {
        landing: landingFr,
      },
    };

    // Detect browser language
    const browserLang = navigator.language.split('-')[0]; // Get 'fr' from 'fr-FR'
    const supportedLang = ['fr', 'en'].includes(browserLang) ? browserLang : 'fr';

    // In development, always reinitialize to support hot reload
    const shouldInitialize = !i18n.isInitialized || process.env.NODE_ENV === 'development';

    if (shouldInitialize) {
      // If already initialized in dev, remove existing resources
      if (i18n.isInitialized && process.env.NODE_ENV === 'development') {
        Object.keys(i18n.store.data).forEach(lng => {
          Object.keys(i18n.store.data[lng] || {}).forEach(ns => {
            i18n.removeResourceBundle(lng, ns);
          });
        });
      }

      i18n
        .use(initReactI18next)
        .init({
          resources,
          lng: supportedLang,
          fallbackLng: 'en',
          debug: process.env.NODE_ENV === 'development',
          
          interpolation: {
            escapeValue: false,
          },
        })
        .then(() => {
          // Update HTML lang attribute
          document.documentElement.lang = supportedLang;
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
  }, []); // Remove criterion translations from dependency array

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
} 