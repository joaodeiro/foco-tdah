# Release · Kairos Focus

Proteção contra dispersão e tempo de tela alto. Modo foco que altera o comportamento do app e integra com iOS quando possível.

Método: **Fluxo Unificado** (fila única, WIP limitado, priorização por cost of delay).

---

## Fila de demandas

| ID | Demanda | Classe de serviço | Cost of delay | Tamanho | Status |
|---|---|---|---|---|---|
| F-01 | Modo Foco UI imersivo (app em grayscale, timer central, sair exige ação consciente) | Standard | Médio | S | pending |
| F-02 | Duração e perfis de sessão (25 / 45 / 90 / custom, respeita nível de energia) | Standard | Baixo | XS | pending |
| F-03 | Registro automático pós-sessão no diário | Standard | Baixo | XS | pending |
| S-01 | Agenda de foco (janelas fixas com lembrete) | Standard | Médio | M | pending |
| S-02 | iOS Shortcut guiado (Focus Mode Apple, Grayscale, abrir Kairos) | Intangible | Alto | M | pending |
| S-03 | Deep link `kairos://focus/start` pra Shortcut chamar | Standard | Baixo | XS | pending |
| C-01 | Declaração diária de apps a evitar | Standard | Médio | S | pending |
| C-02 | Check-in pós-sessão (registro no diário, sem punição) | Standard | Baixo | XS | pending |
| N-01 | Wrapper Capacitor (PWA → app nativo iOS) | Fixed date | Alto | L | pending |
| N-02 | FamilyControls + ShieldConfiguration (bloqueio real de apps) | Fixed date | Muito alto | XL | pending |

---

## Leitura por bloco

**F · Sessão de foco** — o que o Kairos faz de imediato no web
**S · Agenda e automação iOS** — ponte com o sistema operacional via Shortcuts
**C · Compromisso declarativo** — substituto comportamental enquanto bloqueio real não existe
**N · Nativo** — caminho para bloqueio efetivo de apps (requer Apple Developer + entitlement)

---

## Parâmetros de operação

A definir com o solicitante antes de puxar o primeiro item:

- **WIP máximo**: 1 ou 2 itens simultâneos
- **Cadência de revisão**: 3 dias / 5 dias / semanal
- **Primeiro item a puxar**: F-01 é a aposta padrão por cost of delay × tamanho

---

## Critério de "pronto" por item

Cada item vira um commit (ou série) no repositório. "Pronto" = deploy em produção funcionando, não só código mergeado. Registro no `docs/messages.md` se adicionar toast novo.
