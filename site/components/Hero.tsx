"use client";

import { useState } from "react";
import Image from "next/image";
import BotaoWhatsapp from "./BotaoWhatsapp";

export default function Hero() {
  const [nome, setNome] = useState("");
  const nomeExibido =
    nome.trim().length > 0 ? nome.trim() : "Seu Negócio Aqui";

  return (
    <section id="topo" className="hero">
      <div className="hero__media" aria-hidden="true">
        <Image
          src="/demos/salao-1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero__photo"
        />
        <div className="hero__veil" />
        <div className="hero__grain" />
      </div>

      <div className="hero__layout">
        <div className="hero__copy">
          <p className="hero__wordmark">
            kdiff<span className="brand-dot">.</span>
          </p>
          <p className="eyebrow hero__descriptor">Sites para negócios locais</p>
          <h1 className="hero__title">
            Seu negócio tem endereço na rua. Falta um na internet.
          </h1>
          <p className="hero__lead">
            Sites para clínicas, salões, lojas e restaurantes. Feitos para o
            celular, com WhatsApp em todo canto e prontos para o Google.
          </p>

          <div className="hero__composer">
            <label htmlFor="nome-negocio" className="sr-only">
              Nome do seu negócio
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
            <BotaoWhatsapp nomeNegocio={nome} className="btn-sinal">
              Chamar no WhatsApp
            </BotaoWhatsapp>
          </div>

          <a href="#demos" className="hero__secondary">
            ↓ Ver sites de exemplo
          </a>
        </div>

        <div className="hero__device" aria-hidden="true">
          <div className="browser">
            <div className="browser__chrome">
              <span />
              <span />
              <span />
              <div className="browser__url">seusite.com.br</div>
            </div>
            <div className="browser__screen">
              <div className="browser__preview-nav">
                <strong key={nomeExibido} className="browser__preview-name">
                  {nomeExibido}
                </strong>
                <span>Início · Serviços · Contato</span>
              </div>
              <div className="browser__preview-hero">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/demos/pizza-1.jpg"
                  alt=""
                  className="browser__preview-img"
                />
                <div className="browser__preview-overlay">
                  <p>Agende pelo WhatsApp</p>
                  <span className="browser__preview-cta">Chamar agora</span>
                </div>
              </div>
              <div className="browser__preview-rows">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
