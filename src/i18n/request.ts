import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Lista de todos os locales suportados
const locales = ['en', 'pt', 'es'];

export default getRequestConfig(async ({ locale }) => {
  // Valida que o locale da URL é um dos que suportamos.
  // Se não for, a função notFound() do Next.js renderizará a página 404.
  if (!locale || !locales.includes(locale as string)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
    locale: locale as string
  };
});
