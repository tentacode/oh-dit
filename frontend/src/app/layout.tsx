import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from '@/lib/i18n-provider';
import { headingFont } from "@/config/fonts";
import { colorRoles } from "@/config/colors";

export const metadata: Metadata = {
  title: "OhDit - Web Accessibility Audit Tool",
  description: "Professional accessibility audit tool for RGAA 4.1 compliance",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" style={{
      backgroundColor: colorRoles.light,
      color: colorRoles.dark,
    }}>
      <body
        className={`${headingFont.variable} antialiased`}
        
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
