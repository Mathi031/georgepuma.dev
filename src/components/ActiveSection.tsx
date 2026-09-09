"use client";

import { useEffect } from "react";
import { sectionIds } from "@/content/site";

// Stack no está en la nav, así que no participa del estado activo.
const NAV_IDS = [sectionIds.work, sectionIds.method, sectionIds.experience, sectionIds.contact];

/**
 * Estado activo de la nav (sección 5.6 de la spec): sin scroll listeners,
 * un único IntersectionObserver decide qué ancla lleva aria-current. El
 * rootMargin desplaza la franja de detección a un tercio superior de la
 * ventana, que es donde el ojo suele estar leyendo la sección "actual".
 * Cuando ninguna sección cruza la franja (el hero, por ejemplo) no hay ítem
 * activo: el estado no se queda pegado a la última sección visitada.
 * Sin JavaScript no hay aria-current — degradación aceptada por el contrato.
 */
export function ActiveSection() {
  useEffect(() => {
    const nav = document.querySelector("[data-section-nav]");
    if (!nav) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Con dos secciones en la franja gana la primera en orden de lectura.
        const active = NAV_IDS.find((id) => visible.has(id));
        for (const a of nav.querySelectorAll("a[aria-current]")) {
          a.removeAttribute("aria-current");
        }
        if (active) {
          nav.querySelector(`a[href="#${active}"]`)?.setAttribute("aria-current", "location");
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    for (const id of NAV_IDS) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
