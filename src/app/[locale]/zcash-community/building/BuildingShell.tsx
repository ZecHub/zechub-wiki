import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import BuildingBackdrop from "./BuildingBackdrop";
import styles from "./BuildingShell.module.css";

export default function BuildingShell({
  title,
  description,
  children,
  backHref = "/zcash-community/building",
  backLabel = "Community Building",
  showBack = true,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  showBack?: boolean;
}) {
  return (
    <div className={`${styles.shell} relative min-h-screen`}>
      <BuildingBackdrop />
      <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {showBack && (
          <Link
            href={backHref}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 dark:text-[#8aa0b4] dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className={`${styles.description} mt-2 max-w-2xl text-sm text-zinc-600 sm:text-base`}>
            {description}
          </p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
