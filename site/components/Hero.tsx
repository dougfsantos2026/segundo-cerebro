"use client";

import { useState } from "react";
import BotaoWhatsapp from "./BotaoWhatsapp";

export default function Hero() {
  const [nome, setNome] = useState("");
  const nomeExibido = nome.trim().length > 0 ? nome.trim() : "Seu Negócio Aqui";

  return (
    <section id="topo" className="pt-32 pb-24 md:pt-40 md:pb-36">
      <div className="container-k grid items-center gap-12 md:grid-cols-2">
        {/* Coluna de texto */}
        <div>
          <p className="eyebrow anima-1 text-[var(--toldo)]">
            SITES PARA NEGÓCIOS LOCAIS
          </p>
          <h1 className="anima-1 mt-4">
            Seu negócio tem endereço na rua. Falta um na internet.
          </h1>
          <p className="anima-2 mt-6 max-w-prose">
            Faço sites para clínicas, salões, lojas e restaurantes de bairro.
            Feitos para o celular, com WhatsApp em todo canto e prontos para
            aparecer no Google.
          </p>
          <div className="anima-2 mt-8 flex flex-wrap items-center gap-4">
            <BotaoWhatsapp nomeNegocio={nome} />
            <a href="#demos" className="font-medium underline underline-offset-4">
              Ver sites de exemplo
            </a>
          </div>
        </div>

        {/* Coluna do preview de fachada */}
        <div className="anima-3">
          <label htmlFor="nome-negocio" className="eyebrow block">
            VEJA COMO FICARIA
          </label>
          <input
            id="nome-negocio"
            type="text"
            value={nome}
            maxLength={40}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do seu negócio"
            className="mt-2 w-full rounded border-2 border-[var(--tinta)] bg-white px-4 py-3"
          />

          {/* Moldura da fachada */}
          <div className="mt-6 overflow-hidden rounded border border-[var(--tinta)] shadow-[0_2px_0_var(--tinta)]">
            {/* Toldo */}
            <div
              className="h-10"
              style={{
                background:
                  "repeating-linear-gradient(45deg, var(--toldo), var(--toldo) 14px, rgba(255,255,255,0.08) 14px, rgba(255,255,255,0.08) 28px)",
              }}
            />
            {/* Vitrine */}
            <div className="bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <span
                  key={nomeExibido}
                  className="font-[family-name:var(--font-display)] text-xl font-extrabold transition-opacity duration-150 md:text-2xl"
                >
                  {nomeExibido}
                </span>
                <span className="eyebrow hidden text-[rgba(16,26,24,0.5)] md:block">
                  INÍCIO · SERVIÇOS · CONTATO
                </span>
              </div>
              <div className="mt-6 h-3 w-3/4 rounded bg-[rgba(16,26,24,0.1)]" />
              <div className="mt-2 h-3 w-1/2 rounded bg-[rgba(16,26,24,0.1)]" />
              <span className="mt-6 inline-block rounded bg-[var(--toldo)] px-4 py-2 text-sm font-semibold text-white">
                WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
