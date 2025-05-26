'use client';

import { useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    landing: {
      title: "OhDit",
      subtitle: "Web Accessibility Audit Tool",
      comeBackSoon: "Come back soon",
      description: "We're building something amazing for accessibility professionals.",
      rgaaCompliance: "RGAA 4.1 compliance made simple.",
      inDevelopment: "In development"
    },
  },
  fr: {
    landing: {
      title: "OhDit",
      subtitle: "Outil d'Audit d'Accessibilité Web",
      comeBackSoon: "Revenez bientôt",
      description: "Nous construisons quelque chose d'extraordinaire pour les professionnels de l'accessibilité.",
      rgaaCompliance: "La conformité RGAA 4.1 simplifiée.",
      inDevelopment: "En développement"
    },
  },
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0]; // Get 'fr' from 'fr-FR'
    const supportedLang = ['fr', 'en'].includes(browserLang) ? browserLang : 'fr';

    if (!i18n.isInitialized) {
      i18n
        .use(initReactI18next)
        .init({
          resources,
          lng: supportedLang,
          fallbackLng: 'en',
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
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
} 