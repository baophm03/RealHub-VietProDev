"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealOptions = {
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: boolean;
  stagger?: number;
  start?: string;
};

export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const elements = ref.current!.querySelectorAll<HTMLElement>(
        "[data-gsap]"
      );

      if (elements.length > 0) {
        elements.forEach((el, i) => {
          const delay = parseFloat(el.dataset.gsapDelay || "0") + (options.stagger ? i * options.stagger : 0);

          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: el.dataset.gsap === "left" || el.dataset.gsap === "right" ? 0 : options.y ?? 40,
              x: el.dataset.gsap === "left" ? -(options.x ?? 60) : el.dataset.gsap === "right" ? (options.x ?? 60) : 0,
              scale: el.dataset.gsap === "scale" ? options.scale ?? 0.92 : 1,
              filter: options.blur ? "blur(12px)" : "none",
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: options.duration ?? 0.9,
              delay: delay + (options.delay ?? 0),
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: options.start ?? "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

export function useGsapCounter(
  target: number,
  options: { duration?: number; start?: string } = {}
) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: target,
        duration: options.duration ?? 2,
        ease: "power2.out",
        snap: { val: 1 },
        scrollTrigger: {
          trigger: ref.current!,
          start: options.start ?? "top 80%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = obj.val.toLocaleString("vi-VN");
          }
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [target]);

  return ref;
}

export function useGsapParallax<T extends HTMLElement = HTMLDivElement>(
  speed: number = 0.3
) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

export function useGsapHero() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from("[data-hero='eyebrow']", { opacity: 0, y: 20, duration: 0.6 })
        .from("[data-hero='title'] > *", { opacity: 0, y: 40, duration: 0.8, stagger: 0.12 }, "-=0.3")
        .from("[data-hero='desc']", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from("[data-hero='cta'] > *", { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 }, "-=0.3")
        .from("[data-hero='nav']", { opacity: 0, y: -20, duration: 0.5 }, 0);
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
}

export { gsap, ScrollTrigger };
