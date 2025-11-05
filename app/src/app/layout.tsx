import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-lexend-deca",
});

export const metadata: Metadata = {
  title: "Oh Dit",
  description: "Votre application Oh Dit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className='h-full'>
      <body className={`${lexendDeca.variable} antialiased h-full flex`}>
        {children}
      </body>
    </html>
  );
}