import { getTranslations } from "next-intl/server";
import Button from "@/components/Ui/Button";

export default async function ServicesPage() {
  const t = await getTranslations("services");
  const items = [t("invoice"), t("rib"), t("relance"), t("devis"), t("fec"), t("scripts")];

  return (
    <main className="bg-white">
      <div className="page-gutter py-10 md:py-16">
        <h1 className="font-sans text-3xl font-bold text-ink md:text-[45px]">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl font-sans text-base text-muted md:text-xl">
          {t("intro")}
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-card border border-soft-border bg-cream p-6 font-sans text-ink md:p-8"
            >
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-card bg-primary-dark p-6 text-white md:p-8">
          <p className="font-medium break-all">{t("pay")}</p>
          <p className="mt-3">{t("email")}</p>
          <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            <a
              className="underline decoration-orange underline-offset-4"
              href="https://opentask.ai/profiles/cmtsjdrs6000904jl7tdvzgw7"
            >
              {t("opentask")}
            </a>
            <a
              className="underline decoration-orange underline-offset-4"
              href="https://github.com/0n3m0r3/factureae"
            >
              {t("cli")}
            </a>
            <a
              className="underline decoration-orange underline-offset-4"
              href="https://gist.github.com/0n3m0r3/2409217e4e8d3699c1eef8c9c6869dd0"
            >
              frrrib
            </a>
            <a
              className="underline decoration-orange underline-offset-4"
              href="https://gist.github.com/0n3m0r3/58cf7c966b188f5ba7a30ee2d0dbfa77"
            >
              frrelance
            </a>
            <a
              className="underline decoration-orange underline-offset-4"
              href="https://gist.github.com/0n3m0r3/3684ca9ec09061ad836fb109c1138faa"
            >
              frdevis
            </a>
            <a
              className="underline decoration-orange underline-offset-4"
              href="https://gist.github.com/0n3m0r3/0b466853c1c82b951ff525b6da849647"
            >
              frfec
            </a>
          </p>
        </div>
        <div className="mt-10">
          <Button message="services.home" href="/" />
        </div>
      </div>
    </main>
  );
}
