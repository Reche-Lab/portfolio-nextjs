import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import { locales, type Locale } from "@/i18n/routing";
import IntlProvider from "@/components/core/IntlProvider";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// Informa ao Next.js quais locales existem para pré-renderização
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Meu Portfólio",
  description: "Portfólio de Desenvolvedor construído com Next.js e React Three Fiber",
};

// O Layout é um Server Component assíncrono
export default async function LocaleLayout({
  children,
  params, // Recebemos 'params' como um objeto completo
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  // Acessamos 'locale' diretamente do objeto 'params'
  // Isso evita a desestruturação que o Next.js parece estar reclamando
  const currentLocale = params.locale;

  // Buscamos as mensagens no servidor
  const messages = await getMessages();

  return (
    <html lang={currentLocale}>
      <body className={inter.className}>
        {/* Delegamos a lógica do provider para o Componente Cliente */}
        <IntlProvider messages={messages} locale={currentLocale}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
