import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Hero");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-900 p-24 text-center text-white">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold md:text-6xl">{t("title")}</h1>
        <p className="text-lg text-zinc-300 md:text-xl">{t("subtitle")}</p>
      </div>
    </main>
  );
}
