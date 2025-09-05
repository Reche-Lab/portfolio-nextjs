"use client";

import { useTranslations } from "next-intl";
import { MailIcon, LinkedinIcon, GithubIcon } from "../ui/ContactIcons";
import { TitleFX, TextFX } from "@/components/ui/typography";

// Link de contato (card)
const ContactLink = ({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-4 rounded-lg bg-zinc-700 p-4 transition-all hover:-translate-y-0.5 hover:bg-zinc-600 hover:shadow-lg hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
  >
    <div className="text-cyan-400">{icon}</div>
    <TextFX
      as="span"
      text={text}
      className="text-lg font-medium text-zinc-100"
      hoverClassName="hover:text-white hover:scale-105"
    />
  </a>
);

export default function ContactSection() {
  const t = useTranslations("Contact");

  const contactLinks = [
    { href: "mailto:reche.dev.lab@gmail.com", icon: <MailIcon />, text: t("email") },
    { href: "https://www.linkedin.com/in/bruno-reche/", icon: <LinkedinIcon />, text: t("linkedin") },
    { href: "https://github.com/Reche-Lab", icon: <GithubIcon />, text: t("github") },
  ];

  return (
    <section id="contact" className="w-full py-20 lg:py-32 bg-zinc-800">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="space-y-3">
            <TitleFX
              as="h2"
              text={t("title")}
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-white"
              hoverClassName="hover:scale-125 hover:text-emerald-300"
            />
            <TitleFX
              as="h3"
              text={t("description")}
              className="mx-auto max-w-[700px] text-zinc-300 md:text-xl"
              hoverClassName="hover:scale-300 hover:text-yellow-200 hover:font-bold"
            />
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
