import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jesko Jets",
  description:
    "Jesko Jets is a private aviation operator with over 5,000 missions completed across 150+ countries. From international executives to global industries, our clients trust us to deliver on time, every time.",
  keywords: [
    "private jets",
    "luxury aviation",
    "charter flights",
    "private jet charter",
    "Jesko Jets",
    "Gulfstream 650ER",
  ],
  openGraph: {
    title: "Jesko Jets",
    description:
      "Our aircraft are among the first to deliver clients to the most iconic international events.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-jet-950 text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
