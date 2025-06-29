'use client';

import { useTranslation } from 'react-i18next';

export default function Landing() {
  const { t } = useTranslation('landing');
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
} 