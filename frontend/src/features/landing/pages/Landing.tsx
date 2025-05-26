'use client';

import { useTranslation } from 'react-i18next';

export default function Landing() {
  const { t } = useTranslation('landing');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent tracking-tight">
            {t('title')}
          </h1>
          <p className="text-3xl text-slate-700 font-medium">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl text-indigo-800 font-semibold">
            {t('comeBackSoon')}
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('description')}<br />
            <span className="text-indigo-600 font-semibold">RGAA 4.1</span> {t('rgaaCompliance')}
          </p>
        </div>
        
        <div className="pt-6">
          <div className="inline-flex items-center space-x-3 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-200">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-indigo-700 font-medium">{t('inDevelopment')}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 