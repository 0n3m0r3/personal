import Header from "@/components/Header/Header";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function ServicesPage() {
  const t = await getTranslations("services");
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="max-w-xl mx-auto p-6 font-sans text-[#2A2C32]">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{t("title")}</h1>
        <p className="mb-4">{t("intro")}</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>{t("invoice")}</li>
          <li>{t("rib")}</li>
          <li>{t("relance")}</li>
          <li>{t("scripts")}</li>
        </ul>
        <p className="mb-2 font-medium break-all">{t("pay")}</p>
        <p className="mb-4">{t("email")}</p>
        <p className="mb-6">
          <a
            className="underline"
            href="https://opentask.ai/profiles/cmtsjdrs6000904jl7tdvzgw7"
          >
            {t("opentask")}
          </a>
          {" · "}
          <a className="underline" href="https://github.com/0n3m0r3/factureae">
            {t("cli")}
          </a>
          {" · "}
          <a
            className="underline"
            href="https://gist.github.com/0n3m0r3/2409217e4e8d3699c1eef8c9c6869dd0"
          >
            frrrib
          </a>
          {" · "}
          <a
            className="underline"
            href="https://gist.github.com/0n3m0r3/58cf7c966b188f5ba7a30ee2d0dbfa77"
          >
            frrelance
          </a>
        </p>
        <Link href="/" className="underline">
          {t("home")}
        </Link>
      </main>
    </div>
  );
}
