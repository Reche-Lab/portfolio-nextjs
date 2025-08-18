import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'pt', 'es'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'pt',
  localePrefix: 'always',
});
