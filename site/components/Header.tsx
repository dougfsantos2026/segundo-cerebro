"use client";

import BotaoWhatsapp from "./BotaoWhatsapp";

export default function Header() {
  return (
    <header className="site-header is-solid">
      <div className="site-header__inner">
        <a href="#topo" className="site-header__logo">
          kdiff<span className="hero__brand-dot">.</span>
        </a>
        <BotaoWhatsapp>
          <span className="wa-label-full">Chamar no WhatsApp</span>
          <span className="wa-label-short">WhatsApp</span>
        </BotaoWhatsapp>
      </div>
    </header>
  );
}
