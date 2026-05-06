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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://whauzan.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "Wahyu Hauzan Rafi — Software Engineer",
    template: "%s | Wahyu Hauzan",
  },

  description:
    "Software Engineer specializing in React, Next.js, and TypeScript. Building fast, scalable, and user-friendly web apps.",

  openGraph: {
    title: "Wahyu Hauzan Rafi — Software Engineer",
    description:
      "Software Engineer specializing in React, Next.js, and TypeScript.",
    url: "/",
    siteName: "whauzan.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wahyu Hauzan Portfolio",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Wahyu Hauzan Rafi — Software Engineer",
    description:
      "Software Engineer specializing in React, Next.js, and TypeScript.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
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
        {children}
      </body>
    </html>
  );
}
