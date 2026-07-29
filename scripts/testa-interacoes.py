#!/usr/bin/env python3
"""Testa as interações da página: menu mobile, accordion do FAQ, carrossel
de depoimentos e o formulário de orçamento (validação e envio)."""

import base64
import json
import os
import subprocess
import time
import urllib.request

import websocket

BASE = "http://127.0.0.1:3500"
SAIDA = "/opt/cursor/artifacts/kdiff-v4"
os.makedirs(SAIDA, exist_ok=True)
falhas = []


class Aba:
    def __init__(self, largura, altura=900, porta=9361):
        self.perfil = f"/tmp/chrome-inter-{porta}"
        subprocess.run(["rm", "-rf", self.perfil], check=False)
        os.makedirs(self.perfil, exist_ok=True)
        self.proc = subprocess.Popen(
            ["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
             "--disable-dev-shm-usage", f"--user-data-dir={self.perfil}",
             f"--remote-debugging-port={porta}", "--remote-allow-origins=*",
             "--hide-scrollbars", "about:blank"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        for _ in range(40):
            time.sleep(0.25)
            try:
                abas = json.load(urllib.request.urlopen(f"http://127.0.0.1:{porta}/json"))
                alvo = [a for a in abas if a.get("type") == "page"]
                if alvo:
                    self.ws = websocket.create_connection(
                        alvo[0]["webSocketDebuggerUrl"], timeout=30)
                    break
            except Exception:
                continue
        self.id = 0
        self.call("Runtime.enable")
        self.call("Page.enable")
        self.call("Emulation.setDeviceMetricsOverride",
                  {"width": largura, "height": altura,
                   "deviceScaleFactor": 1, "mobile": largura < 768})

    def call(self, metodo, params=None):
        self.id += 1
        self.ws.send(json.dumps({"id": self.id, "method": metodo, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.id:
                return msg

    def ev(self, expr, promessa=False):
        r = self.call("Runtime.evaluate",
                      {"expression": expr, "returnByValue": True,
                       "awaitPromise": promessa})
        detalhes = r.get("result", {}).get("exceptionDetails")
        if detalhes:
            raise RuntimeError(detalhes.get("text", "") +
                               str(detalhes.get("exception", {}).get("description", "")))
        return r["result"]["result"].get("value")

    def abrir(self, caminho="/"):
        self.call("Page.navigate", {"url": BASE + caminho})
        for _ in range(60):
            time.sleep(0.25)
            if self.ev("document.readyState") == "complete":
                break
        time.sleep(1.5)

    def tecla(self, tipo, key, code, keycode, texto=None):
        p = {"type": tipo, "key": key, "code": code,
             "windowsVirtualKeyCode": keycode, "nativeVirtualKeyCode": keycode}
        if texto is not None:
            p["text"] = texto
        self.call("Input.dispatchKeyEvent", p)

    def captura(self, nome):
        c = self.call("Page.captureScreenshot", {"format": "png"})
        caminho = f"{SAIDA}/{nome}.png"
        with open(caminho, "wb") as f:
            f.write(base64.b64decode(c["result"]["data"]))
        return caminho

    def fechar(self):
        try:
            self.ws.close()
        except Exception:
            pass
        self.proc.kill()


def checar(condicao, descricao):
    print(("  OK    " if condicao else "  FALHA ") + descricao)
    if not condicao:
        falhas.append(descricao)


# ---------------------------------------------------------------- menu mobile
print("\nMenu mobile (375px)")
aba = Aba(375, porta=9361)
try:
    aba.abrir("/")
    checar(aba.ev("document.querySelector('#menu-mobile').hidden") is True,
           "menu começa fechado")
    checar(aba.ev("document.querySelector('[aria-controls=menu-mobile]')"
                  ".getAttribute('aria-expanded')") == "false",
           "aria-expanded começa em false")
    checar(aba.ev("""[...document.querySelectorAll('header a')]
             .filter(a => a.textContent.trim() === 'Solicitar orçamento'
                       && a.getBoundingClientRect().width > 0).length""") == 0,
           "CTA de desktop fica oculto no celular")

    aba.ev("document.querySelector('[aria-controls=menu-mobile]').click()")
    time.sleep(0.6)
    checar(aba.ev("document.querySelector('#menu-mobile').hidden") is False,
           "menu abre ao clicar")
    checar(aba.ev("document.querySelector('[aria-controls=menu-mobile]')"
                  ".getAttribute('aria-expanded')") == "true",
           "aria-expanded vira true")
    checar(aba.ev("getComputedStyle(document.body).overflow") == "hidden",
           "rolagem do fundo é travada")
    itens = aba.ev("""document.querySelectorAll('#menu-mobile a').length""")
    checar(itens == 8, f"menu lista 7 links + CTA (encontrados {itens})")
    checar(aba.ev("""[...document.querySelectorAll('#menu-mobile a')]
             .every(a => a.getBoundingClientRect().right <= window.innerWidth + 1)"""),
           "nenhum link do menu sai da tela")
    aba.captura("menu-mobile-aberto")

    aba.tecla("keyDown", "Escape", "Escape", 27)
    aba.tecla("keyUp", "Escape", "Escape", 27)
    time.sleep(0.5)
    checar(aba.ev("document.querySelector('#menu-mobile').hidden") is True,
           "Escape fecha o menu")
    checar(aba.ev("document.activeElement.getAttribute('aria-controls')") == "menu-mobile",
           "foco volta para o botão do menu")

    aba.ev("document.querySelector('[aria-controls=menu-mobile]').click()")
    time.sleep(0.4)
    aba.ev("""[...document.querySelectorAll('#menu-mobile a')]
             .find(a => a.textContent.includes('Projetos')).click()""")
    time.sleep(0.8)
    checar(aba.ev("document.querySelector('#menu-mobile').hidden") is True,
           "menu fecha ao escolher um link")
finally:
    aba.fechar()

# ------------------------------------------------------------- FAQ e carrossel
print("\nFAQ e carrossel (1280px)")
aba = Aba(1280, porta=9362)
try:
    aba.abrir("/")
    aba.ev("document.querySelector('#faq').scrollIntoView()")
    time.sleep(0.8)
    checar(aba.ev("""[...document.querySelectorAll('[id^=faq-botao-]')]
             .every(b => b.getAttribute('aria-expanded') === 'false')"""),
           "todas as perguntas começam fechadas")
    checar(aba.ev("""[...document.querySelectorAll('[id^=faq-painel-]')]
             .every(p => p.hidden && p.getAttribute('role') === 'region'
                      && p.getAttribute('aria-labelledby'))"""),
           "painéis têm role e aria-labelledby corretos")

    aba.ev("document.querySelectorAll('[id^=faq-botao-]')[2].click()")
    time.sleep(0.4)
    checar(aba.ev("document.querySelectorAll('[id^=faq-botao-]')[2]"
                  ".getAttribute('aria-expanded')") == "true",
           "pergunta abre ao clicar")
    checar(aba.ev("document.querySelectorAll('[id^=faq-painel-]')[2].hidden") is False,
           "resposta correspondente fica visível")

    # Ativação por teclado (Enter) em outra pergunta.
    aba.ev("document.querySelectorAll('[id^=faq-botao-]')[4].focus()")
    aba.tecla("keyDown", "Enter", "Enter", 13, "\r")
    aba.tecla("keyUp", "Enter", "Enter", 13)
    time.sleep(0.4)
    checar(aba.ev("document.querySelectorAll('[id^=faq-botao-]')[4]"
                  ".getAttribute('aria-expanded')") == "true",
           "Enter abre a pergunta focada")
    aba.captura("faq-aberto")

    depoimentos = aba.ev("""(() => {
      const r = document.querySelector('[aria-roledescription=carrossel]');
      if (!r) return null;
      r.scrollIntoView();
      return r.querySelector('[aria-roledescription=slide]').getAttribute('aria-label');
    })()""")
    checar(depoimentos == "Depoimento 1 de 3", f"carrossel inicia no slide 1 ({depoimentos})")
    aba.ev("""[...document.querySelectorAll('button')]
             .find(b => b.getAttribute('aria-label') === 'Próximo depoimento').click()""")
    time.sleep(0.5)
    checar(aba.ev("""document.querySelector('[aria-roledescription=slide]')
             .getAttribute('aria-label')""") == "Depoimento 2 de 3",
           "botão avança para o slide 2")
    aba.ev("""[...document.querySelectorAll('button')]
             .find(b => b.getAttribute('aria-label') === 'Depoimento anterior').click()""")
    aba.ev("""[...document.querySelectorAll('button')]
             .find(b => b.getAttribute('aria-label') === 'Depoimento anterior').click()""")
    time.sleep(0.5)
    checar(aba.ev("""document.querySelector('[aria-roledescription=slide]')
             .getAttribute('aria-label')""") == "Depoimento 3 de 3",
           "voltar do slide 1 dá a volta para o 3")
finally:
    aba.fechar()

# ------------------------------------------------------------------ formulário
print("\nFormulário de orçamento (1280px)")
aba = Aba(1280, porta=9363)
try:
    aba.abrir("/")
    aba.ev("document.querySelector('#contato').scrollIntoView()")
    time.sleep(0.8)

    checar(aba.ev("""[...document.querySelectorAll('#contato input, #contato select, #contato textarea')]
             .every(c => !!document.querySelector('label[for=\\''+c.id+'\\']'))"""),
           "todo campo tem label associado")

    # Envio vazio deve barrar e apontar os erros.
    aba.ev("document.querySelector('#contato form').requestSubmit()")
    time.sleep(0.6)
    erros = aba.ev("document.querySelectorAll('#contato [id$=-erro]').length")
    checar(erros >= 6, f"envio vazio mostra erros por campo ({erros})")
    checar(aba.ev("document.querySelector('#contato-nome').getAttribute('aria-invalid')") == "true",
           "campo inválido recebe aria-invalid")
    checar(aba.ev("document.activeElement.id") == "contato-nome",
           "foco vai para o primeiro campo com erro")
    aba.captura("form-erros")

    # E-mail malformado.
    aba.ev("""(() => {
      const set = (id, v) => {
        const el = document.getElementById(id);
        const p = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set;
        p.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('contato-nome', 'Maria Souza');
      set('contato-whatsapp', '11999998888');
      set('contato-email', 'maria@');
      set('contato-mensagem', 'Tenho uma clínica e preciso de um site novo.');
      const sel = (id, v) => {
        const el = document.getElementById(id);
        const p = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set;
        p.call(el, v);
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      sel('contato-segmento', 'Clínica ou consultório');
      sel('contato-tipoProjeto', 'Site institucional');
      return true;
    })()""")
    time.sleep(0.3)
    aba.ev("document.querySelector('#contato form').requestSubmit()")
    time.sleep(0.6)
    checar(aba.ev("!!document.querySelector('#contato-email-erro')"),
           "e-mail inválido é rejeitado")
    checar(aba.ev("!!document.querySelector('#contato-consentimento-erro')"),
           "consentimento é obrigatório")

    # Corrige e envia de verdade.
    aba.ev("""(() => {
      const el = document.getElementById('contato-email');
      const p = Object.getOwnPropertyDescriptor(el.constructor.prototype, 'value').set;
      p.call(el, 'maria@clinica.com.br');
      el.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('contato-consentimento').click();
      return true;
    })()""")
    time.sleep(0.3)
    aba.ev("document.querySelector('#contato form').requestSubmit()")
    time.sleep(2.5)
    checar(aba.ev("!!document.querySelector('#contato [role=status]')"),
           "envio válido mostra confirmação")
    texto = aba.ev("""(document.querySelector('#contato [role=status]')||{}).textContent || ''""")
    checar("enviado" in texto.lower(), f"mensagem de confirmação exibida")
    aba.captura("form-sucesso")

    # Honeypot: pedido preenchido deve ser aceito silenciosamente pela API.
    resposta = aba.ev("""fetch('/api/contato', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ website: 'http://spam.example', nome: '', email: '' })
    }).then(r => r.status + ':' + JSON.stringify(r.ok))""", promessa=True)
    checar(resposta.startswith("200"), f"honeypot descarta bot sem denunciar ({resposta})")

    invalido = aba.ev("""fetch('/api/contato', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ nome: 'x' })
    }).then(r => r.status)""", promessa=True)
    checar(invalido == 422, f"API rejeita dados inválidos ({invalido})")
finally:
    aba.fechar()

print("\nRESULTADO:",
      "TUDO OK" if not falhas else f"{len(falhas)} FALHA(S)")
for f in falhas:
    print("  -", f)
