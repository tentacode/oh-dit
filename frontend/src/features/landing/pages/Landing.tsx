'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function Landing() {
  const { t } = useTranslation('landing');
  return (
    <div className="min-h-screen bg-base-200">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-accent/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Hero Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300 mb-8">
            <div className="card-body text-center py-16">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-primary-content" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              
              {/* Main Title */}
              <h1 className="text-6xl md:text-7xl font-bold text-base-content mb-4 tracking-tight">
                {t('title')}
              </h1>
              
              {/* Subtitle */}
              <p className="text-2xl md:text-3xl text-base-content/70 font-medium mb-8">
                {t('subtitle')}
              </p>

              {/* Status Badge */}
              <div className="flex justify-center mb-8">
                <div className="badge badge-success gap-2 p-4 text-sm">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  {t('inDevelopment')}
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/project/my-project/criterion/1.2?page=456" className="btn btn-primary btn-lg gap-3 mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {t('comeBackSoon')}
              </Link>
            </div>
          </div>

          {/* Description Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Story Card */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="card-title text-lg">Notre mission</h3>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  {t('description')}
                </p>
              </div>
            </div>

            {/* Trust Card */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="card-title text-lg">Conformité RGAA 4.1</h3>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  Audit complet selon les standards <span className="badge badge-outline">RGAA 4.1</span> {t('rgaaCompliance')}
                </p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8">
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title mb-6 justify-center">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  Fonctionnalités à venir
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h4 className="font-medium mb-2">Audit automatisé</h4>
                    <p className="text-sm text-base-content/60">Tests automatiques des critères RGAA</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
                      </svg>
                    </div>
                    <h4 className="font-medium mb-2">Collaboration</h4>
                    <p className="text-sm text-base-content/60">Travail en équipe sur les audits</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 17v-2.34a3.99 3.99 0 00-4.75-3.92L4 10.5V9c0-5.5 3.36-7.2 8-7.2s8 1.7 8 7.2v1.5l-.25.24A3.99 3.99 0 0015 14.66V17h-6z"/>
                      </svg>
                    </div>
                    <h4 className="font-medium mb-2">Rapports détaillés</h4>
                    <p className="text-sm text-base-content/60">Exports PDF et recommandations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 