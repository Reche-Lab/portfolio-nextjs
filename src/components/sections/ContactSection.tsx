"use client";

import { useTranslations } from "next-intl";
import { MailIcon, LinkedinIcon, GithubIcon } from "../ui/ContactIcons";

// Componente reutilizável para cada link de contato
const ContactLink = ({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-4 rounded-lg bg-zinc-700 p-4 transition-colors hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
  >
    <div className="text-cyan-400">{icon}</div>
    <span className="text-lg font-medium text-zinc-100">{text}</span>
  </a>
);

export default function ContactSection() {
  const t = useTranslations("Contact");

  const contactLinks = [
    {
      href: "mailto:reche.dev.lab@gmail.com",
      icon: <MailIcon />,
      text: t("email"),
    },
    {
      href: "https://www.linkedin.com/in/bruno-reche/",
      icon: <LinkedinIcon />,
      text: t("linkedin" ),
    },
    {
      href: "https://github.com/Reche-Lab",
      icon: <GithubIcon />,
      text: t("github" ),
    },
  ];

  return (
    <section id="contact" className="w-full py-20 lg:py-32 bg-zinc-800">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
              {t("title")}
            </h2>
            <p className="mx-auto max-w-[700px] text-zinc-300 md:text-xl">
              {t("description")}
            </p>
          </div>
          
          <div className="w-full max-w-sm space-y-4 pt-4">
            {contactLinks.map((link) => (
              <ContactLink key={link.href} {...link} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
