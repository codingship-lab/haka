"use client";

import dynamic from "next/dynamic";
import {
  CSSProperties,
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import styles from "@/components/landing/landing-page.module.css";
import {
  ABOUT_FACTS,
  BIRTH_DATE,
  CONTACTS,
  HERO_PILLS,
  SECTION_THEMES,
  SECTIONS,
  STACK_ITEMS,
  type ContactLink,
  type SectionDefinition,
  type SectionId,
} from "@/components/landing/site-data";

const SceneCanvas = dynamic(
  () =>
    import("@/components/landing/scene-canvas").then((module) => ({
      default: module.SceneCanvas,
    })),
  {
    ssr: false,
  },
);

type CSSVariableStyle = CSSProperties & Record<`--${string}`, string>;

function getCurrentAge(birthDateString: string) {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  const monthDifference = today.getUTCMonth() - birthDate.getUTCMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getUTCDate() < birthDate.getUTCDate())
  ) {
    age -= 1;
  }

  return age;
}

function createThemeTween(
  nextTheme: Record<`--${string}`, string>,
): gsap.TweenVars & Record<`--${string}`, string> {
  return {
    duration: 1.05,
    ease: "power2.out",
    ...nextTheme,
  };
}

function getFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function applySurfaceTilt(target: HTMLElement, clientX: number, clientY: number) {
  const rect = target.getBoundingClientRect();
  const px = (clientX - rect.left) / rect.width;
  const py = (clientY - rect.top) / rect.height;
  const rotateX = (0.5 - py) * 8;
  const rotateY = (px - 0.5) * 11;

  target.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
  target.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
  target.style.setProperty("--glow-x", `${(px * 100).toFixed(2)}%`);
  target.style.setProperty("--glow-y", `${(py * 100).toFixed(2)}%`);
}

function resetSurfaceTilt(target: HTMLElement) {
  target.style.setProperty("--tilt-x", "0deg");
  target.style.setProperty("--tilt-y", "0deg");
  target.style.setProperty("--glow-x", "50%");
  target.style.setProperty("--glow-y", "50%");
}

function applyMagneticHover(target: HTMLElement, clientX: number, clientY: number) {
  const rect = target.getBoundingClientRect();
  const px = (clientX - rect.left) / rect.width;
  const py = (clientY - rect.top) / rect.height;
  const translateX = (px - 0.5) * 10;
  const translateY = (py - 0.5) * 8;

  target.style.transform = `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0)`;
  target.style.setProperty("--button-glow-x", `${(px * 100).toFixed(2)}%`);
  target.style.setProperty("--button-glow-y", `${(py * 100).toFixed(2)}%`);
}

function resetMagneticHover(target: HTMLElement) {
  target.style.transform = "translate3d(0, 0, 0)";
  target.style.setProperty("--button-glow-x", "50%");
  target.style.setProperty("--button-glow-y", "50%");
}

function HeroSection({
  section,
  age,
  setHoveredSection,
  onShellMove,
  onShellLeave,
  onButtonMove,
  onButtonLeave,
}: {
  section: SectionDefinition;
  age: number;
  setHoveredSection: (value: SectionId | null) => void;
  onShellMove: (event: React.PointerEvent<HTMLElement>) => void;
  onShellLeave: (event: React.PointerEvent<HTMLElement>) => void;
  onButtonMove: (event: React.PointerEvent<HTMLAnchorElement>) => void;
  onButtonLeave: (event: React.PointerEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <div
      className={styles.sectionShell}
      data-shell
      onPointerEnter={() => setHoveredSection(section.id)}
      onPointerMove={onShellMove}
      onPointerLeave={(event) => {
        setHoveredSection(null);
        onShellLeave(event);
      }}
      style={{ "--section-accent": section.accent } as CSSVariableStyle}
    >
      <div className={styles.content}>
        <div className={styles.sectionTop}>
          <span className={styles.eyebrow} data-reveal>
            {section.eyebrow}
          </span>
          <span className={styles.sectionIndex} data-reveal>
            {section.index} / {section.label}
          </span>
        </div>

        <div className={styles.heroGrid}>
          <div className={styles.titleWrap}>
            <h1 className={styles.displayTitle} data-reveal>
              {section.title}
            </h1>
            <p className={styles.lead} data-reveal>
              {section.description}
            </p>
            <div className={styles.pillRow} data-reveal>
              {HERO_PILLS.map((pill) => (
                <span className={styles.pill} key={pill}>
                  {pill}
                </span>
              ))}
            </div>
            <span className={styles.scrollCue} data-reveal>
              scroll to explore
            </span>
          </div>

          <aside className={styles.aside}>
            <div className={styles.metricCard} data-reveal>
              <span className={styles.metricEyebrow}>Возраст</span>
              <strong className={styles.metricValue} suppressHydrationWarning>
                {`${age} лет`}
              </strong>
              <p className={styles.metricNote}>
                Возраст считается от даты рождения 31.05.2010, чтобы лендинг не
                устаревал после следующего дня рождения.
              </p>
            </div>

            <div className={styles.metricCard} data-reveal>
              <span className={styles.metricEyebrow}>Фокус</span>
              <strong className={styles.metricValue}>UI + Motion + 3D</strong>
              <p className={styles.metricNote}>
                React, Next.js, web 3D сцены и аккуратные hover-переходы без
                перегруза интерфейса.
              </p>
            </div>

            <a
              className={styles.contactButton}
              data-reveal
              href="#contact"
              onPointerMove={onButtonMove}
              onPointerLeave={onButtonLeave}
            >
              Перейти к контактам
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DefaultSection({
  section,
  children,
  setHoveredSection,
  onShellMove,
  onShellLeave,
}: {
  section: SectionDefinition;
  children: React.ReactNode;
  setHoveredSection: (value: SectionId | null) => void;
  onShellMove: (event: React.PointerEvent<HTMLElement>) => void;
  onShellLeave: (event: React.PointerEvent<HTMLElement>) => void;
}) {
  return (
    <div
      className={styles.sectionShell}
      data-shell
      onPointerEnter={() => setHoveredSection(section.id)}
      onPointerMove={onShellMove}
      onPointerLeave={(event) => {
        setHoveredSection(null);
        onShellLeave(event);
      }}
      style={{ "--section-accent": section.accent } as CSSVariableStyle}
    >
      <div className={styles.content}>
        <div className={styles.sectionTop}>
          <span className={styles.eyebrow} data-reveal>
            {section.eyebrow}
          </span>
          <span className={styles.sectionIndex} data-reveal>
            {section.index} / {section.label}
          </span>
        </div>

        <div className={styles.sectionGrid}>{children}</div>
      </div>
    </div>
  );
}

function ContactButtons({
  contacts,
  onButtonMove,
  onButtonLeave,
}: {
  contacts: ContactLink[];
  onButtonMove: (event: React.PointerEvent<HTMLAnchorElement>) => void;
  onButtonLeave: (event: React.PointerEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <div className={styles.contactActions} data-reveal>
      {contacts.map((contact) => (
        <a
          key={contact.label}
          className={styles.contactButton}
          href={contact.href}
          rel="noreferrer"
          target={contact.href.startsWith("mailto:") ? undefined : "_blank"}
          onPointerMove={onButtonMove}
          onPointerLeave={onButtonLeave}
        >
          {contact.label}
        </a>
      ))}
    </div>
  );
}

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeSection, setActiveSection] = useState(0);
  const deferredSection = useDeferredValue(activeSection);
  const [hoveredSection, setHoveredSection] = useState<SectionId | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const age = getCurrentAge(BIRTH_DATE);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  const applyTheme = useEffectEvent((nextIndex: number) => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    startTransition(() => {
      setActiveSection(nextIndex);
    });

    gsap.to(root, createThemeTween(SECTION_THEMES[SECTIONS[nextIndex].tone]));
  });

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    applyTheme(0);

    const lenis = new Lenis({
      autoRaf: false,
      duration: reducedMotion ? 0.01 : 1.15,
      smoothWheel: !reducedMotion,
      touchMultiplier: 1,
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    const context = gsap.context(() => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) {
          return;
        }

        ScrollTrigger.create({
          trigger: section,
          start: "top 56%",
          end: "bottom 44%",
          onEnter: () => applyTheme(index),
          onEnterBack: () => applyTheme(index),
        });

        const revealTargets = section.querySelectorAll("[data-reveal]");
        gsap.fromTo(
          revealTargets,
          {
            opacity: 0,
            y: 48,
            rotateX: -8,
            filter: "blur(18px)",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: reducedMotion ? 0.01 : 1.02,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
            },
          },
        );

        const shell = section.querySelector<HTMLElement>("[data-shell]");
        if (!shell) {
          return;
        }

        gsap.fromTo(
          shell,
          {
            opacity: 0,
            y: 72,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: reducedMotion ? 0.01 : 1.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          },
        );
      });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      context.revert();
      lenis.destroy();
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);

  const handleShellMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!getFinePointer()) {
      return;
    }

    applySurfaceTilt(event.currentTarget, event.clientX, event.clientY);
  };

  const handleShellLeave = (event: React.PointerEvent<HTMLElement>) => {
    resetSurfaceTilt(event.currentTarget);
  };

  const handleButtonMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!getFinePointer()) {
      return;
    }

    applyMagneticHover(event.currentTarget, event.clientX, event.clientY);
  };

  const handleButtonLeave = (event: React.PointerEvent<HTMLAnchorElement>) => {
    resetMagneticHover(event.currentTarget);
  };

  return (
    <div className={styles.page} ref={rootRef}>
      <div className={styles.sceneWrap}>
        <SceneCanvas
          activeSection={deferredSection}
          hoveredSection={hoveredSection}
          reducedMotion={reducedMotion}
        />
      </div>
      <div className={styles.grain} />

      <div className={styles.floatingRail} aria-hidden="true">
        {SECTIONS.map((section, index) => (
          <button
            key={section.id}
            className={`${styles.railDot} ${index === activeSection ? styles.railDotActive : ""}`}
            onClick={() => {
              document.getElementById(section.id)?.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start",
              });
            }}
            type="button"
          />
        ))}
      </div>

      <main className={styles.main}>
        {SECTIONS.map((section, index) => {
          if (section.id === "hero") {
            return (
              <section
                className={styles.section}
                id={section.id}
                key={section.id}
                ref={(node) => {
                  sectionRefs.current[index] = node;
                }}
              >
                <HeroSection
                  age={age}
                  onButtonLeave={handleButtonLeave}
                  onButtonMove={handleButtonMove}
                  onShellLeave={handleShellLeave}
                  onShellMove={handleShellMove}
                  section={section}
                  setHoveredSection={setHoveredSection}
                />
              </section>
            );
          }

          if (section.id === "about") {
            return (
              <section
                className={styles.section}
                id={section.id}
                key={section.id}
                ref={(node) => {
                  sectionRefs.current[index] = node;
                }}
              >
                <DefaultSection
                  onShellLeave={handleShellLeave}
                  onShellMove={handleShellMove}
                  section={section}
                  setHoveredSection={setHoveredSection}
                >
                  <div className={styles.copyBlock}>
                    <h2 className={styles.sectionTitle} data-reveal>
                      {section.title}
                    </h2>
                    <p className={styles.description} data-reveal>
                      {section.description}
                    </p>
                  </div>

                  <div className={styles.factRow} data-reveal>
                    {ABOUT_FACTS.map((fact) => (
                      <span className={styles.fact} key={fact}>
                        {fact}
                      </span>
                    ))}
                  </div>
                </DefaultSection>
              </section>
            );
          }

          if (section.id === "stack") {
            return (
              <section
                className={styles.section}
                id={section.id}
                key={section.id}
                ref={(node) => {
                  sectionRefs.current[index] = node;
                }}
              >
                <DefaultSection
                  onShellLeave={handleShellLeave}
                  onShellMove={handleShellMove}
                  section={section}
                  setHoveredSection={setHoveredSection}
                >
                  <div className={styles.copyBlock}>
                    <h2 className={styles.sectionTitle} data-reveal>
                      {section.title}
                    </h2>
                    <p className={styles.description} data-reveal>
                      {section.description}
                    </p>
                  </div>

                  <div className={styles.stackCloud} data-reveal>
                    {STACK_ITEMS.map((item) => (
                      <span className={styles.stackItem} key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </DefaultSection>
              </section>
            );
          }

          return (
            <section
              className={styles.section}
              id={section.id}
              key={section.id}
              ref={(node) => {
                sectionRefs.current[index] = node;
              }}
            >
              <DefaultSection
                onShellLeave={handleShellLeave}
                onShellMove={handleShellMove}
                section={section}
                setHoveredSection={setHoveredSection}
              >
                <div className={styles.contactShell}>
                  <h2 className={styles.sectionTitle} data-reveal>
                    {section.title}
                  </h2>
                  <p className={styles.contactCopy} data-reveal>
                    {section.description}
                  </p>
                </div>

                <ContactButtons
                  contacts={CONTACTS}
                  onButtonLeave={handleButtonLeave}
                  onButtonMove={handleButtonMove}
                />
              </DefaultSection>
            </section>
          );
        })}
      </main>
    </div>
  );
}
