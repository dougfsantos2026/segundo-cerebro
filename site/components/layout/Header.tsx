"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navegacaoPrincipal } from "@/data/navegacao";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Logo from "./Logo";

/** Ids das seções observadas para marcar o item ativo do menu. */
const idsSecoes = navegacaoPrincipal
  .filter((item) => item.href.startsWith("#"))
  .map((item) => item.href.slice(1));

export default function Header() {
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null);
  const botaoMenuRef = useRef<HTMLButtonElement>(null);

  // Fundo do cabeçalho fica sólido depois de sair do topo.
  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 16);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Destaca no menu a seção que está sendo lida.
  useEffect(() => {
    const secoes = idsSecoes
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (secoes.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setSecaoAtiva(visivel.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    secoes.forEach((secao) => observador.observe(secao));
    return () => observador.disconnect();
  }, []);

  const fecharMenu = useCallback(() => {
    setMenuAberto(false);
    botaoMenuRef.current?.focus();
  }, []);

  // Fecha com Escape e trava a rolagem do fundo enquanto o menu está aberto.
  useEffect(() => {
    if (!menuAberto) return;

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") fecharMenu();
    };

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [menuAberto, fecharMenu]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        rolou || menuAberto
          ? "border-b border-white/10 bg-grafite-950/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#inicio"
          className="shrink-0 rounded-md"
          aria-label="Ir para o início do site"
        >
          <Logo />
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-x-5 lg:flex xl:gap-x-7"
        >
          {navegacaoPrincipal.map((item) => {
            const ativo = secaoAtiva === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={ativo ? "true" : undefined}
                className={cn(
                  "relative rounded-md py-2 text-[13px] font-medium transition-colors xl:text-sm",
                  ativo ? "text-white" : "text-grafite-300 hover:text-white",
                )}
              >
                {item.rotulo}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ciano-400 transition-transform duration-300",
                    ativo ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/*
            A visibilidade fica no contêiner: aplicar `hidden` direto no botão
            competiria com o `inline-flex` do próprio componente.
          */}
          <div className="hidden sm:block">
            <Button href="#contato">Solicitar orçamento</Button>
          </div>

          <button
            ref={botaoMenuRef}
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {menuAberto ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Painel de navegação mobile */}
      <div
        id="menu-mobile"
        hidden={!menuAberto}
        className="border-t border-white/10 bg-grafite-950/95 backdrop-blur-xl lg:hidden"
      >
        <nav
          aria-label="Navegação principal (mobile)"
          className="mx-auto flex max-h-[calc(100svh-4.5rem)] w-full max-w-7xl flex-col overflow-y-auto px-5 py-6 sm:px-8"
        >
          {navegacaoPrincipal.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={fecharMenu}
              className="border-b border-white/5 py-3.5 text-base font-medium text-grafite-200 transition-colors hover:text-white"
            >
              {item.rotulo}
            </a>
          ))}
          <Button
            href="#contato"
            tamanho="lg"
            className="mt-6 w-full"
            onClick={fecharMenu}
          >
            Solicitar orçamento
          </Button>
        </nav>
      </div>
    </header>
  );
}
