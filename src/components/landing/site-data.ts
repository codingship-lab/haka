export type SectionId = "hero" | "about" | "stack" | "contact";
export type SectionTone = "mist" | "deep" | "ice" | "clear";

export type SectionDefinition = {
  id: SectionId;
  index: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  tone: SectionTone;
  accent: string;
};

export type ContactLink = {
  label: string;
  href: string;
};

export const BIRTH_DATE = "2010-05-31T00:00:00Z";

export const SECTION_THEMES: Record<SectionTone, Record<`--${string}`, string>> = {
  mist: {
    "--page-bg": "#f7fbff",
    "--page-bg-secondary": "#edf6ff",
    "--page-ink": "#10233e",
    "--page-muted": "#5a728f",
    "--page-halo": "rgba(129, 207, 255, 0.34)",
    "--page-halo-soft": "rgba(182, 232, 255, 0.26)",
    "--panel-bg": "rgba(255, 255, 255, 0.68)",
    "--panel-border": "rgba(112, 180, 235, 0.22)",
    "--button-bg": "rgba(255, 255, 255, 0.82)",
    "--button-border": "rgba(92, 154, 214, 0.18)",
    "--button-text": "#10233e",
    "--mesh-a": "#7ccfff",
    "--mesh-b": "#f7fbff",
    "--mesh-glow": "#9ee2ff",
  },
  deep: {
    "--page-bg": "#061838",
    "--page-bg-secondary": "#0c2455",
    "--page-ink": "#f2f8ff",
    "--page-muted": "#abc2df",
    "--page-halo": "rgba(82, 172, 255, 0.28)",
    "--page-halo-soft": "rgba(32, 91, 179, 0.32)",
    "--panel-bg": "rgba(12, 28, 66, 0.58)",
    "--panel-border": "rgba(146, 202, 255, 0.18)",
    "--button-bg": "rgba(18, 40, 89, 0.72)",
    "--button-border": "rgba(137, 198, 255, 0.2)",
    "--button-text": "#f6fbff",
    "--mesh-a": "#2c63ff",
    "--mesh-b": "#75d2ff",
    "--mesh-glow": "#8ee0ff",
  },
  ice: {
    "--page-bg": "#eef7ff",
    "--page-bg-secondary": "#e1f0ff",
    "--page-ink": "#0d2139",
    "--page-muted": "#60758f",
    "--page-halo": "rgba(116, 201, 255, 0.3)",
    "--page-halo-soft": "rgba(174, 227, 255, 0.28)",
    "--panel-bg": "rgba(252, 254, 255, 0.62)",
    "--panel-border": "rgba(118, 188, 240, 0.18)",
    "--button-bg": "rgba(255, 255, 255, 0.8)",
    "--button-border": "rgba(99, 168, 228, 0.16)",
    "--button-text": "#10233e",
    "--mesh-a": "#66c7ff",
    "--mesh-b": "#d9f4ff",
    "--mesh-glow": "#80dbff",
  },
  clear: {
    "--page-bg": "#f4fbff",
    "--page-bg-secondary": "#eaf4ff",
    "--page-ink": "#10233e",
    "--page-muted": "#5d748d",
    "--page-halo": "rgba(88, 184, 255, 0.22)",
    "--page-halo-soft": "rgba(189, 232, 255, 0.22)",
    "--panel-bg": "rgba(255, 255, 255, 0.7)",
    "--panel-border": "rgba(127, 194, 241, 0.18)",
    "--button-bg": "rgba(255, 255, 255, 0.84)",
    "--button-border": "rgba(93, 164, 224, 0.18)",
    "--button-text": "#10233e",
    "--mesh-a": "#8ad8ff",
    "--mesh-b": "#ffffff",
    "--mesh-glow": "#a6e6ff",
  },
};

export const SECTIONS: SectionDefinition[] = [
  {
    id: "hero",
    index: "01",
    label: "Intro",
    eyebrow: "Alexander / Frontend + Motion + Web 3D",
    title: "Александр",
    description:
      "Минималистичные интерфейсы, плавный motion и сцены, которые ощущаются как часть продукта, а не как декоративный слой.",
    tone: "mist",
    accent: "#72cfff",
  },
  {
    id: "about",
    index: "02",
    label: "About",
    eyebrow: "Обо мне",
    title: "Чистая подача, мягкий свет и уверенное движение.",
    description:
      "Мне нравится собирать страницы, где типографика, ритм и глубина работают вместе. Ближе всего мне front-end, interactive web и сцены в realtime.",
    tone: "deep",
    accent: "#69bfff",
  },
  {
    id: "stack",
    index: "03",
    label: "Stack",
    eyebrow: "Направление",
    title: "React, Next.js, three.js, shaders и продуманный scroll.",
    description:
      "Я тянусь к интерфейсам, в которых техническая часть не мешает эстетике: архитектура остаётся чистой, а анимация усиливает восприятие.",
    tone: "ice",
    accent: "#8ad8ff",
  },
  {
    id: "contact",
    index: "04",
    label: "Contact",
    eyebrow: "Связь",
    title: "Если нужен личный лендинг, motion-heavy UI или web 3D, можно написать.",
    description:
      "Выбирай любой удобный канал. Кнопки ниже ведут напрямую в контактные точки без лишнего текста и перегруза.",
    tone: "clear",
    accent: "#73cfff",
  },
];

export const HERO_PILLS = [
  "React / Next.js",
  "Three.js / R3F",
  "GSAP / Lenis",
  "Shaders / PostFX",
];

export const ABOUT_FACTS = [
  "Родился 31.05.2010",
  "Фокус на clean UI и motion",
  "Люблю мягкие формы и ритм",
];

export const STACK_ITEMS = [
  "App Router architecture",
  "Reusable UI systems",
  "three.js scenes",
  "Custom ShaderMaterial",
  "GSAP timelines",
  "ScrollTrigger sync",
  "Responsive landing pages",
  "Performance-aware motion",
];

export const CONTACTS: ContactLink[] = [
  {
    label: "Discord",
    href: "https://discord.com/users/@hookamori",
  },
  {
    label: "VK",
    href: "https://vk.com/Rimac_Emrys",
  },
  {
    label: "Telegram",
    href: "https://t.me/Jesqman",
  },
  {
    label: "Email",
    href: "mailto:me@hookamori.qzz.io",
  },
];
