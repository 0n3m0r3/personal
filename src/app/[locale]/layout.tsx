import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Mulish } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Louka Altdorf Reynes",
  description: "Louka Altdorf Reynes' personal website",
};

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mulish",
});

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={mulish.variable}>
        {/* Wrap the app in NextIntlClientProvider */}
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
