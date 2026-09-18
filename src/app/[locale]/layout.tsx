import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import localFont from "next/font/local";
import Header from "@/components/Header/Header";
import ScrollReveal from "@/components/Ui/ScrollReveal";
import Footer from "@/components/Footer/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "metadata" });
  return { title: t("title"), description: t("description") };
}

const mulish = localFont({
  src: "../fonts/mulish-latin.woff2",
  weight: "400 800",
  style: "normal",
  display: "swap",
  variable: "--font-mulish",
});

const fraunces = localFont({
  src: "../fonts/fraunces-latin.woff2",
  weight: "300 700",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-fraunces",
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(
    ["common", "languageSelector", "carousel", "skills", "chat"].map((key) => [
      key,
      messages[key],
    ]),
  );
  return (
    <html lang={locale}>
      <body
        className={`${mulish.variable} ${fraunces.variable} bg-white font-sans antialiased`}
      >
        <NextIntlClientProvider messages={clientMessages}>
          <ScrollReveal key={locale} />
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
