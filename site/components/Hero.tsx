"use client";

import { useState } from "react";
import BotaoWhatsapp from "./BotaoWhatsapp";

export default function Hero() {
  const [nome, setNome] = useState("");
  const nomeExibido = nome.trim().length > 0 ? nome.trim() : "Seu Negócio Aqui";

  return (
    <section id="topo" className="hero">
      <div className="hero__facade" aria-hidden="true">
        <div className="hero__awning" />
        <div className="hero__window">
          <div className="hero__window-shine" />
          <div className="hero__window-inner">
            <span key={nomeExibido} className="hero__sign-name">
              {nomeExibido}
            </span>
            <p className="eyebrow hero__sign-nav">Início · Serviços · Contato</p>
            <div className="hero__skeleton">
              <span />
              <span />
              <span className="hero__skeleton-btn">WhatsApp</span>
            </div>
          </div>
        </div>
        <div className="hero__sidewalk" />
      </div>

      <div className="hero__copy">
        <p className="hero__wordmark">
          kdiff<span className="hero__brand-dot">.</span>
        </p>
        <p className="eyebrow hero__descriptor">Sites para negócios locais</p>
        <h1 className="hero__title">
          Seu negócio tem endereço na rua. Falta um na internet.
        </h1>
        <p className="hero__lead">
          Faço sites para clínicas, salões, lojas e restaurantes de bairro.
          Feitos para o celular, com WhatsApp em todo canto e prontos para
          aparecer no Google.
        </p>

        <div className="hero__actions">
          <BotaoWhatsapp nomeNegocio={nome} />
          <a href="#demos" className="btn-ghost underline">
            Ver sites de exemplo
          </a>
        </div>

        <div className="hero__composer">
          <label htmlFor="nome-negocio" className="eyebrow">
            Veja como ficaria
          </label>
          <input
            id="nome-negocio"
            type="text"
            value={nome}
            maxLength={40}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do seu negócio"
            autoComplete="organization"
          />
        </div>
      </div>
    </section>
  );
}
