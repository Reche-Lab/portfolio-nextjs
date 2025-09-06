import LocaleSelect from "../ui/LocaleSelect";
import ExportCVButton from "@/components/ui/ExportCVButton";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full p-4 sm:p-6 z-10">
      <nav className="flex items-center justify-end">
        <ExportCVButton />
        <LocaleSelect />
      </nav>
    </header>
  );
}
