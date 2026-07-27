"use client";

import { useEffect, useState } from "react";
import BotaoWhatsapp from "./BotaoWhatsapp";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-solid" : ""}`}>
      <div className="site-header__inner">
        <a href="#topo" className="site-header__logo">
          kdiff<span className="brand-dot">.</span>
        </a>
        <nav className="site-header__nav" aria-label="Principal">
          <a href="#demos">Exemplos</a>
          <a href="#processo">Como funciona</a>
        </nav>
        <BotaoWhatsapp className="btn-sinal btn-sinal--sm">
          <span className="wa-label-full">Chamar no WhatsApp</span>
          <span className="wa-label-short">WhatsApp</span>
        </BotaoWhatsapp>
      </div>
    </header>
  );
}
