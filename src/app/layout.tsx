import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { PersonaProvider } from "@/components/layout/PersonaWrapper";

export const metadata: Metadata = {
  title: "Lemontree InsightEngine",
  description: "Dashboard layering food pantry data with NYC Census demographics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PersonaProvider>
          {children}
        </PersonaProvider>
      </body>
    </html>
  );
}
