// src/app/[locale]/page.tsx
'use client';

import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import Image from "next/image";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Fuel,
  Barcode,
  Camera,
  Wrench,
  Database,
  Bell,
  Sparkles,
  Droplet,
  Palette,
  CalendarDays,
  Menu,
  X,
  Code2,
  Printer,
  FileCheck,
  Scan,
  Zap,
  Target,
  Cpu,
  Monitor,
  Smartphone,
  Globe,
  Settings,
  BarChart3,
  FileCode,
  Workflow,
  PenTool,
} from "lucide-react";

import LangSwitcher from "@/components/lang-switcher";

// i18n messages
import sk from "@/i18n/dictionaries/sk.json";
import en from "@/i18n/dictionaries/en.json";
import de from "@/i18n/dictionaries/de.json";

type Locale = "sk" | "en" | "de";
type Messages = typeof sk;
type Feature = { icon: ReactNode; text: string };

// ---- i18n helpers ----
const MESSAGES: Record<Locale, Messages> = { sk, en, de };

function getFromDict(dict: Messages, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (typeof acc === "object" && acc !== null && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict as unknown);
}
// -----------------------------------

// Fallbacky pre prípad, že nové kľúče ešte nie sú v prekladoch
const FALLBACK_DIGI_TITLE = "Digitalizácia – rýchly prehľad";
const FALLBACK_DIGI_SUB = "Kompletné pokrytie od objednávky po doručenie";
const FALLBACK_DIGI_ITEMS = [
  "Klientský portál objednávok (stav, faktúry, reklamácie)",
  "eProof / online schvaľovanie náhľadov s anotáciami",
  "Automatický preflight a opravy PDF + report",
  "APS plánovanie výroby podľa termínov a strojov",
  "MES-lite terminály: štart/stop, odvádzka, checklisty",
  "OEE/TPM dashboardy, dôvody prestojov, trendy",
  "Track & Trace + expedícia, kuriéri, POD archivácia",
  "Sklad materiálu/dielov: FIFO, šarže, inventúry mobilom",
  "Cenotvorba & kalkulácie (šablóny, normy, marža)",
  "IoT zber dát zo strojov, alarmy, senzory",
  "AI predikcie porúch a sklzov, odhad lead-time",
  "RMA/Reklamačný modul s 8D reportom",
  "Integrácie: ERP/MIS, e-shop, účtovníctvo, BI",
  "Archivácia a verzovanie tlačových dát s právami",
];

const FALLBACK_MAINT_ITEMS = [
  "QR karty strojov + história zásahov",
  "Sklad ND prepojený na stroje & zásahy",
  "Checklisty a fotodokumentácia po zásahu",
  "Push/SMS notifikácie (manuálne aj auto)",
  "MTTR/MTBF prehľady a trendy",
];

const FALLBACK_PRINT_TITLE = "Digitalizácia tlačiarní";
const FALLBACK_PRINT_SUB = "Workflow & zákazky pod kontrolou";
const FALLBACK_PRINT_ITEMS = [
  "Príjem a triedenie zákaziek (web/API/e-mail parser)",
  "Generovanie čiarových/QR kódov a štítkov",
  "Tracking výroby s notifikáciami pre klientov",
  "Klientsky portál & schvaľovanie nátlačkov",
];

export default function GpcsLanding({ params }: { params: { locale: Locale } }) {
  const lang: Locale = (params?.locale ?? "sk") as Locale;
  const messages = MESSAGES[lang] ?? MESSAGES.sk;

  // t() teraz podporuje aj fallback
  const t = useCallback((path: string, fallback?: string) => {
    const v = getFromDict(messages, path);
    return typeof v === "string" ? v : (fallback ?? path);
  }, [messages]);

  // tList() – načítanie zoznamu (array) s fallbackom
  const tList = useCallback((path: string, fallback: string[]) => {
    const v = getFromDict(messages, path);
    return Array.isArray(v) ? (v as unknown[]).map(String) : fallback;
  }, [messages]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const prefersReducedMotion = useReducedMotion();
  const closeMenu = useCallback(() => setMobileOpen(false), []);

  const animFast = { duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" as const };

  useEffect(() => {
    const id = setTimeout(() => {}, 8000);
    return () => clearTimeout(id);
  }, []);

  const featuresScan = useMemo<Feature[]>(
    () => [
      { icon: <Camera className="size-5" />, text: t("scan.s1") },
      { icon: <Barcode className="size-5" />, text: t("scan.s2") },
      { icon: <Layers className="size-5" />, text: t("scan.s3") },
      { icon: <Sparkles className="size-5" />, text: t("scan.s4") },
      { icon: <Droplet className="size-5" />, text: t("scan.s5") },
      { icon: <Palette className="size-5" />, text: t("scan.s6") },
    ],
    [t]
  );

  const featuresMaint = useMemo<Feature[]>(
    () => [
      { icon: <Wrench className="size-5" />, text: t("maint.s1") },
      { icon: <CalendarDays className="size-5" />, text: t("maint.s2") },
      { icon: <Sparkles className="size-5" />, text: t("maint.s3") },
      { icon: <Database className="size-5" />, text: t("maint.s4") },
      { icon: <Bell className="size-5" />, text: t("maint.s5") },
      { icon: <ShieldCheck className="size-5" />, text: t("maint.s6") },
    ],
    [t]
  );

  // Digitalizácia – názov, podtitul a položky cez i18n
  const digiTitle = t("digital.quick.title", FALLBACK_DIGI_TITLE);
  const digiSub = t("digital.quick.sub", FALLBACK_DIGI_SUB);
  const digiItems = useMemo<string[]>(
    () => tList("digital.quick.items", FALLBACK_DIGI_ITEMS),
    [tList]
  );

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (res.ok) {
        setStatus("success");
        e.currentTarget.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 6000);
    }
  }

  // výrazne blikajúca položka „Novinka“
  const blinkNav = prefersReducedMotion
    ? undefined
    : { opacity: [1, 0.5, 1], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const } };

  // SILNÉ blikanie motta (vpravo hore)
  const blinkMotto = prefersReducedMotion
    ? undefined
    : {
        opacity: [1, 0.3, 1],
        scale: [1, 1.05, 1],
        transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-svh bg-[#0a0a0f] text-slate-100 grid-pattern">
        {/* Header - Modern glassmorphism */}
        <header className="sticky top-0 z-50 glass">
          <div className="pt-[env(safe-area-inset-top)]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <m.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <Image src="/gpcs.png" alt="GPCS logo" width={40} height={40} priority className="rounded-xl ring-2 ring-cyan-400/30 object-cover" />
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-sm -z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight gradient-text">GPCS s.r.o.</span>
                  <span className="hidden sm:inline text-xs text-slate-400">Global Printing & Control Solutions</span>
                </div>
              </m.div>

              <div className="flex items-center gap-3">
                <LangSwitcher className="md:hidden" />
                <nav className="hidden md:flex items-center gap-1 text-sm">
                  <NavLink href="#produkty">{t("nav.products")}</NavLink>
                  <NavLink href="#codestudio">CodeStudio</NavLink>
                  <m.a href="#novinka" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white" animate={blinkNav}>{t("nav.news")}</m.a>
                  <NavLink href="#prinosy">{t("nav.benefits")}</NavLink>
                                    <NavLink href="#kontakt">{t("nav.contact")}</NavLink>
                  <LangSwitcher className="ml-2" />
                </nav>
                <button
                  type="button"
                  aria-label="Menu"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                  className="md:hidden inline-flex items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/5 p-2 hover:bg-cyan-400/10 transition-colors"
                  onClick={() => setMobileOpen((v) => !v)}
                >
                  {mobileOpen ? <X className="size-5 text-cyan-400" /> : <Menu className="size-5 text-cyan-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <m.nav
            id="mobile-menu"
            initial={false}
            animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
            transition={animFast}
            className="md:hidden overflow-hidden border-t border-white/10 glass"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
              <div className="grid gap-1">
                <a onClick={closeMenu} href="#produkty" className="block rounded-lg px-3 py-3 hover:bg-cyan-400/10 transition-colors">{t("nav.products")}</a>
                <a onClick={closeMenu} href="#codestudio" className="block rounded-lg px-3 py-3 hover:bg-cyan-400/10 transition-colors text-cyan-400">CodeStudio</a>
                <m.a onClick={closeMenu} href="#novinka" className="block rounded-lg px-3 py-3 hover:bg-cyan-400/10 transition-colors" animate={blinkNav}>{t("nav.news")}</m.a>
                <a onClick={closeMenu} href="#prinosy" className="block rounded-lg px-3 py-3 hover:bg-cyan-400/10 transition-colors">{t("nav.benefits")}</a>
                                <a onClick={closeMenu} href="#kontakt" className="block rounded-lg px-3 py-3 hover:bg-cyan-400/10 transition-colors">{t("nav.contact")}</a>
              </div>
            </div>
          </m.nav>
        </header>

        {/* HERO - Modern with CMYK inspired elements */}
        <section className="relative overflow-hidden scroll-mt-24 min-h-[90vh] flex items-center">
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.15),transparent)]" />
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/5 rounded-full blur-[150px]" />
          </div>
          
          {/* CMYK Registration marks decoration */}
          <div className="absolute top-20 left-10 hidden lg:block">
            <CMYKMark />
          </div>
          <div className="absolute bottom-20 right-10 hidden lg:block">
            <CMYKMark />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
            {/* Badge */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm text-cyan-300">
                <Printer className="size-4" />
                {t("badge")}
              </span>
            </m.div>

            {/* Main headline */}
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block">{t("hero.title")}</span>
                <m.span
                  className="block mt-2 gradient-text"
                  animate={blinkMotto}
                >
                  {t("hero.motto")}
                </m.span>
              </h1>
            </m.div>

            {/* Lead text */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 max-w-3xl mx-auto text-center"
            >
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
                {t("hero.lead")}
              </p>
              <p className="mt-4 text-base sm:text-lg font-medium text-cyan-300">
                {t("hero.digital")}
              </p>
            </m.div>

            {/* CTA Buttons */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <a
                href="#demo"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-105"
              >
                {t("hero.ctaDemo")}
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#produkty"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                {t("hero.ctaProducts")}
              </a>
            </m.div>

            {/* Stats/Features row */}
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <StatCard icon={<Scan className="size-6" />} label="AI Vision" value="ΔE < 1" />
              <StatCard icon={<Barcode className="size-6" />} label="Barcode" value="100%" />
              <StatCard icon={<Wrench className="size-6" />} label="Údržba" value="MTTR ↓" />
              <StatCard icon={<Zap className="size-6" />} label="Prestoje" value="-40%" />
            </m.div>
          </div>
        </section>

        {/* Digitalization Overview - Bento Grid */}
        <section className="py-16 sm:py-24 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold">{digiTitle}</h2>
              <p className="mt-3 text-slate-400 max-w-2xl mx-auto">{digiSub}</p>
            </m.div>

            {/* Bento Grid */}
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {/* Large feature card */}
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="md:col-span-2 lg:row-span-2 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                      <Workflow className="size-6 text-cyan-400" />
                    </div>
                    <span className="text-sm text-cyan-400 font-medium">Workflow</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Kompletná digitalizácia</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {digiItems.slice(0, 7).map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 text-cyan-400 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </m.div>

              {/* OCR Card */}
              <BentoCard
                icon={<FileCheck className="size-5" />}
                title="OCR + Barcode"
                subtitle={t("cards.ocr.sub")}
                items={[t("cards.ocr.i1"), t("cards.ocr.i2"), t("cards.ocr.i3")]}
                color="blue"
              />

              {/* SSIM Card */}
              <BentoCard
                icon={<Target className="size-5" />}
                title="ΔE & SSIM"
                subtitle={t("cards.ssim.sub")}
                items={[t("cards.ssim.i1"), t("cards.ssim.i2"), t("cards.ssim.i3")]}
                color="fuchsia"
              />

              {/* Maintenance Card */}
              <BentoCard
                icon={<Wrench className="size-5" />}
                title={t("cards.maint.title")}
                subtitle={t("cards.maint.sub")}
                items={tList("cards.maint.items", FALLBACK_MAINT_ITEMS).slice(0, 3)}
                color="amber"
              />

              {/* Print Digitalization Card */}
              <BentoCard
                icon={<Printer className="size-5" />}
                title={t("cards.print.title", FALLBACK_PRINT_TITLE)}
                subtitle={t("cards.print.sub", FALLBACK_PRINT_SUB)}
                items={tList("cards.print.items", FALLBACK_PRINT_ITEMS).slice(0, 3)}
                color="emerald"
              />
            </div>
          </div>
        </section>

        {/* Produkty */}
        <section id="produkty" className="scroll-mt-24 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("products.title")}</h2>
            <p className="mt-2 text-slate-300 max-w-3xl">{t("products.lead")}</p>

            <div className="mt-8 grid gap-10 md:grid-cols-2">
              <div>
                <ProductCard badge="Scancontroll" title={t("products.scan.title")} desc={t("products.scan.desc")} features={featuresScan} />
                <div className="mt-4">
                  <m.a
                    href="https://youtu.be/x982OFN7b1c"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-white shadow-[0_0_16px_rgba(34,211,238,0.25)] hover:bg-cyan-400/20 hover:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                    initial={{ opacity: 0.95, scale: 1 }}
                    animate={{ opacity: [1, 0.78, 1], scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("links.scanVideo")}
                  </m.a>
                </div>
              </div>

              <div>
                <ProductCard badge="MaintControl" title={t("products.maint.title")} desc={t("products.maint.desc")} features={featuresMaint} />
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <m.a
                    href="https://youtu.be/MupquW0d2Gk"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-white shadow-[0_0_16px_rgba(34,211,238,0.25)] hover:bg-cyan-400/20 hover:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                    initial={{ opacity: 0.95, scale: 1 }}
                    animate={{ opacity: [1, 0.78, 1], scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("links.maintMobile")}
                  </m.a>
                  <m.a
                    href="https://youtu.be/SiQ-EJXkXh0"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm text-white shadow-[0_0_16px_rgba(34,211,238,0.25)] hover:bg-cyan-400/20 hover:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                    initial={{ opacity: 0.95, scale: 1 }}
                    animate={{ opacity: [1, 0.78, 1], scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t("links.maintKpi")}
                  </m.a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NOVINKA: KIOSK */}
        <section id="novinka" className="scroll-mt-24 py-12 sm:py-16 border-y border-white/10 bg-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                  {t("nav.news")}
                </span>
                <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">{t("news.kiosk.title")}</h2>
                <p className="mt-2 text-slate-300">{t("news.kiosk.p1")}</p>

                <div className="mt-4 space-y-2 text-slate-300">
                  <h3 className="font-semibold text-white">{t("news.kiosk.pgTitle")}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t("news.kiosk.pg1")}</li>
                    <li>{t("news.kiosk.pg2")}</li>
                    <li>{t("news.kiosk.pg3")}</li>
                  </ul>
                  <h3 className="mt-3 font-semibold text-white">{t("news.kiosk.entryTitle")}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>{t("news.kiosk.en1")}</li>
                    <li>{t("news.kiosk.en2")}</li>
                    <li>{t("news.kiosk.en3")}</li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/WHG9FbVTPNk"
                    title={t("news.kiosk.title")}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  {t("news.kiosk.ytPrompt")}{" "}
                  <a href="https://youtu.be/WHG9FbVTPNk" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-white">
                    {t("news.kiosk.ytOpen")}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CODESTUDIO Section */}
        <section id="codestudio" className="scroll-mt-24 py-16 sm:py-24 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
          <div className="absolute inset-0 halftone-pattern opacity-30" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 text-sm text-fuchsia-300 mb-4">
                <Code2 className="size-4" />
                Vývoj na mieru
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold">
                <span className="gradient-text">CodeStudio</span>
              </h2>
              <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                Profesionálny vývoj softvéru pre prepress, tlač a výrobu. Od webových aplikácií po komplexné podnikové systémy.
              </p>
            </m.div>

            {/* CodeStudio Features Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <CodeStudioCard
                icon={<Monitor className="size-6" />}
                title="Webové aplikácie"
                description="Moderné React/Next.js aplikácie s responzívnym dizajnom a optimálnym výkonom."
                features={["React & Next.js", "TypeScript", "Tailwind CSS", "REST & GraphQL API"]}
                color="cyan"
              />
              <CodeStudioCard
                icon={<Smartphone className="size-6" />}
                title="Mobilné aplikácie"
                description="Natívne a cross-platform aplikácie pre iOS a Android s offline podporou."
                features={["React Native", "Flutter", "Offline-first", "Push notifikácie"]}
                color="blue"
              />
              <CodeStudioCard
                icon={<Cpu className="size-6" />}
                title="Backend & API"
                description="Škálovateľné backend riešenia s bezpečnými API a integráciami."
                features={["Node.js & Python", "Spring Boot", "FastAPI", "Microservices"]}
                color="emerald"
              />
              <CodeStudioCard
                icon={<Database className="size-6" />}
                title="Databázy & BI"
                description="Návrh databáz, ETL procesy a business intelligence dashboardy."
                features={["PostgreSQL", "MongoDB", "Power BI", "Custom dashboardy"]}
                color="amber"
              />
              <CodeStudioCard
                icon={<Settings className="size-6" />}
                title="Integrácie"
                description="Prepojenie s ERP, MIS, e-shopmi a externými službami."
                features={["SAP & Navision", "Pohoda & Money", "Shopify & WooCommerce", "Kuriéri API"]}
                color="fuchsia"
              />
              <CodeStudioCard
                icon={<BarChart3 className="size-6" />}
                title="AI & Automatizácia"
                description="Implementácia AI modelov, OCR, computer vision a automatizačných workflow."
                features={["OpenCV & TensorFlow", "OCR & Barcode", "Prediktívna údržba", "Workflow automatizácia"]}
                color="rose"
              />
            </div>

            {/* Tech Stack */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <p className="text-sm text-slate-500 mb-6">Technológie, ktoré používame</p>
              <div className="flex flex-wrap justify-center gap-4">
                {["React", "Next.js", "TypeScript", "Python", "Node.js", "PostgreSQL", "Docker", "AWS", "Vercel"].map((tech) => (
                  <span key={tech} className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-slate-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </m.div>

            {/* CTA */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white font-semibold shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all hover:scale-105"
              >
                <FileCode className="size-5" />
                Konzultácia projektu
                <ArrowRight className="size-4" />
              </a>
            </m.div>
          </div>
        </section>

        {/* PRÍNOSY - Modernized */}
        <section id="prinosy" className="scroll-mt-24 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold">{t("benefits.title")}</h2>
            </m.div>
            <div className="grid gap-6 md:grid-cols-3">
              <BenefitCard 
                icon={<Target className="size-6" />}
                title={t("benefits.b1.t")} 
                text={t("benefits.b1.d")} 
                color="cyan"
              />
              <BenefitCard 
                icon={<Zap className="size-6" />}
                title={t("benefits.b2.t")} 
                text={t("benefits.b2.d")} 
                color="amber"
              />
              <BenefitCard 
                icon={<FileCheck className="size-6" />}
                title={t("benefits.b3.t")} 
                text={t("benefits.b3.d")} 
                color="emerald"
              />
            </div>
          </div>
        </section>

        {/* Demo CTA */}
        <section id="demo" className="scroll-mt-24 py-12 sm:py-16 border-y border-white/10 bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("demo.title")}</h3>
                <p className="mt-2 text-slate-300 max-w-xl">{t("demo.lead")}</p>
                <ul className="mt-4 space-y-2 text-slate-300">
                  {[t("demo.i1"), t("demo.i2"), t("demo.i3")].map((s) => (
                    <li key={s} className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-cyan-400" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
                <form className="grid gap-3" onSubmit={handleContactSubmit}>
                  <input type="text" name="honey" tabIndex={-1} autoComplete="off" className="hidden" />
                  <div>
                    <label className="block text-sm text-slate-300">{t("form.name")}</label>
                    <input name="name" required className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500" placeholder={t("form.namePh")} autoComplete="name" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm text-slate-300">E-mail</label>
                      <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500" placeholder="you@company.com" autoComplete="email" inputMode="email" />
                    </div>
                    <div>
                      <label className="block text sm text-slate-300">{t("form.phone")}</label>
                      <input name="phone" type="tel" className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500" placeholder="+421 9xx xxx xxx" autoComplete="tel" inputMode="tel" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300">{t("form.note")}</label>
                    <textarea name="message" rows={3} required className="mt-1 w-full rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-base outline-none focus:ring-2 focus:ring-cyan-500" placeholder={t("form.notePh")} />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button type="submit" disabled={status === "loading"} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 hover:bg-cyan-400 disabled:opacity-60">
                      {status === "loading" ? t("form.sending") : (<>{t("form.submit")} <ArrowRight className="size-4" /></>)}
                    </button>
                    <a href="mailto:info@gpcs.sk" className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-slate-100 hover:bg-white/5">
                      info@gpcs.sk
                    </a>
                  </div>

                  <p className="mt-2 text-sm" aria-live="polite">
                    {status === "success" && <span className="text-emerald-400">{t("form.ok")}</span>}
                    {status === "error" && <span className="text-rose-400">{t("form.err")}</span>}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Modern */}
        <footer id="kontakt" className="scroll-mt-24 py-16 border-t border-white/10 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-10 md:grid-cols-4">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <Image src="/gpcs.png" alt="GPCS logo" width={40} height={40} className="rounded-xl ring-2 ring-cyan-400/30" />
                  <div>
                    <p className="font-bold gradient-text">GPCS s.r.o.</p>
                    <p className="text-xs text-slate-500">Global Printing & Control Solutions</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-4">
                  Digitalizácia tlačiarní a výroby. AI kontrola kvality, údržba strojov, workflow automatizácia.
                </p>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-semibold text-white mb-4">{t("nav.products")}</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#produkty" className="hover:text-cyan-400 transition-colors">Scancontroll</a></li>
                  <li><a href="#produkty" className="hover:text-cyan-400 transition-colors">MaintControl</a></li>
                  <li><a href="#codestudio" className="hover:text-cyan-400 transition-colors">CodeStudio</a></li>
                  <li><a href="#novinka" className="hover:text-cyan-400 transition-colors">KIOSK</a></li>
                </ul>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Odkazy</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                                    <li><a href="#demo" className="hover:text-cyan-400 transition-colors">{t("nav.demo")}</a></li>
                  <li><span className="text-slate-500">{t("footer.docs")}</span></li>
                  <li><span className="text-slate-500">{t("footer.int")}</span></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold text-white mb-4">{t("nav.contact")}</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <Globe className="size-4 text-cyan-400" />
                    <a href="mailto:info@gpcs.sk" className="hover:text-cyan-400 transition-colors">info@gpcs.sk</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Smartphone className="size-4 text-cyan-400" />
                    <span>+421 950 889 523</span>
                  </li>
                  <li className="text-slate-500">IČO: 57 150 061</li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500">© {new Date().getFullYear()} GPCS s.r.o. Všetky práva vyhradené.</p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-600">{t("footer.sec")}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </LazyMotion>
  );
}

function Card({ title, subtitle, items }: { title: string; subtitle: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium text-white">{title}</p>
        <Fuel className="size-4 text-cyan-400" />
      </div>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-300">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-cyan-400" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({
  badge,
  title,
  desc,
  features,
}: {
  badge: string;
  title: string;
  desc: string;
  features: Feature[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-xl">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
        {badge}
      </span>
      <h3 className="mt-3 text-lg sm:text-xl font-semibold text-white">{title}</h3>
      <p className="mt-1 text-slate-300">{desc}</p>
      <ul className="mt-4 grid gap-2 text-sm text-slate-300">
        {features.map((f) => (
          <li key={f.text} className="flex items-center gap-2">
            <span className="grid place-items-center rounded-lg border border-white/10 bg-slate-900/60 p-1.5 text-cyan-300">
              {f.icon}
            </span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Benefit({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <h4 className="text-base sm:text-lg font-semibold text-white">{title}</h4>
      <p className="mt-1 text-slate-300">{text}</p>
    </div>
  );
}

// ============ NEW COMPONENTS ============

// Navigation Link
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white"
    >
      {children}
    </a>
  );
}

// CMYK Registration Mark - Print industry decoration
function CMYKMark() {
  return (
    <div className="relative w-16 h-16">
      {/* Outer circle */}
      <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
      {/* Cross */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-700" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700" />
      {/* CMYK dots */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-500/60" />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-500/60" />
      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-fuchsia-500/60" />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-900" />
    </div>
  );
}

// Stat Card for Hero section
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all group">
      <div className="flex justify-center mb-2 text-cyan-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );
}

// Bento Card for grid layout
function BentoCard({ 
  icon, 
  title, 
  subtitle, 
  items, 
  color = "cyan" 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  items: string[]; 
  color?: "cyan" | "blue" | "fuchsia" | "amber" | "emerald" | "rose";
}) {
  const colorClasses = {
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
    blue: "border-blue-400/20 bg-blue-400/10 text-blue-400",
    fuchsia: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-400",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-400",
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
    rose: "border-rose-400/20 bg-rose-400/10 text-rose-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-5 hover:border-white/20 transition-all group">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg border ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// CodeStudio Card
function CodeStudioCard({
  icon,
  title,
  description,
  features,
  color = "cyan",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color?: "cyan" | "blue" | "fuchsia" | "amber" | "emerald" | "rose";
}) {
  const colorClasses = {
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-400/20 group-hover:border-cyan-400/40",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-400/20 group-hover:border-blue-400/40",
    fuchsia: "from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-400/20 group-hover:border-fuchsia-400/40",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-400/20 group-hover:border-amber-400/40",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-400/20 group-hover:border-emerald-400/40",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-400/20 group-hover:border-rose-400/40",
  };

  const iconColors = {
    cyan: "text-cyan-400",
    blue: "text-blue-400",
    fuchsia: "text-fuchsia-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
  };

  return (
    <div className={`group rounded-2xl border bg-gradient-to-br ${colorClasses[color]} p-6 transition-all hover:scale-[1.02]`}>
      <div className={`mb-4 ${iconColors[color]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {features.map((f) => (
          <span key={f} className="px-2 py-1 rounded-md bg-white/5 text-xs text-slate-300 border border-white/10">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

// Benefit Card with icon
function BenefitCard({
  icon,
  title,
  text,
  color = "cyan",
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  color?: "cyan" | "amber" | "emerald";
}) {
  const colorClasses = {
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-400",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-400",
    emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-6 hover:border-white/20 transition-all">
      <div className={`inline-flex p-3 rounded-xl border ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-slate-400">{text}</p>
    </div>
  );
}

























