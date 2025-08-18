"use client"; // Marca este como um Componente Cliente

import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { type Locale } from "@/i18n/routing";

type Props = {
  messages: AbstractIntlMessages;
  locale: Locale;
  children: React.ReactNode;
};

export default function IntlProvider({ messages, locale, children }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
