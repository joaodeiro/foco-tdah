# Release · Kairos Mobile (Expo)

Rewrite do produto principal de PWA → app nativo via Expo + React Native.

## Decisões

- **Estrutura**: monorepo pnpm com `apps/web`, `apps/mobile`, `packages/shared`.
- **Runtime**: Expo Go (free tier, sem Apple Developer, sem EAS) durante spike e uso pessoal. Se distribuir depois, migra pra EAS Build.
- **Nome**: Kairos. **Bundle ID**: `app.kairos`. **Scheme**: `kairos`.
- **Login flow**: e-mail + senha direto no mobile. Magic link só na web.
- **Abas iniciais**: manter paridade com web (Hoje / Tarefas / Diário / Perfil) até validar se essa é a arquitetura certa no mobile.
- **Backend**: Supabase + `apps/web/api/*` permanecem únicos. Mobile consome.
- **Estilo**: NativeWind 4 com paleta do `@kairos/shared/theme`.
- **Fontes**: Instrument Serif + Inter + JetBrains Mono via `@expo-google-fonts`.

## Fila

| ID | Item | Tamanho | Status |
|---|---|---|---|
| Mo-01 | Monorepo + scaffold `apps/mobile` + spike Login | L | ✅ shipado |
| Mo-02 | Validar visualmente no Expo Go (você no iPhone) | — | aguardando |
| Mo-03 | Portar Hoje (energia, top 3, lista de tarefas) | L | pending |
| Mo-04 | Portar TimerModal com grayscale nativo | M | pending |
| Mo-05 | Portar Tarefas + NewTaskSheet + BreakdownSheet + BookmarkSheet | L | pending |
| Mo-06 | Portar Diário + CommitmentSection (check-in) | M | pending |
| Mo-07 | Portar Perfil + ShortcutsGuide nativo | S | pending |
| Mo-08 | Portar Chat (ChatSheet + useChat consumindo `/api/ai/chat`) | M | pending |
| Mo-09 | Reset password e signup flow completo | S | pending |
| Mo-10 | Push notifications nativas (finalmente funcionais no iOS) | M | pending |
| Mo-11 | Stripar `apps/web` pra LP + API apenas | S | pending |
| Mo-12 | Refazer LP estática (Astro ou Next minimal) | M | pending |

## O que o usuário precisa fazer entre Mo-01 e Mo-02

### Pré-requisitos no Mac
1. Node 20+ (via nvm ou brew)
2. pnpm: `npm i -g pnpm`
3. App **Expo Go** no iPhone (App Store, grátis)

### Passos
```bash
# No Mac, na raiz do repo clonado
pnpm install

# Variáveis de ambiente pro mobile
cp apps/mobile/.env.example apps/mobile/.env

# Inicia
pnpm mobile
```

Abre a câmera do iPhone, escaneia o QR code. App carrega no Expo Go.

Se rede Wi-Fi bloqueia LAN ou houver problema de conectividade:
```bash
pnpm mobile -- --tunnel
```

### Validação do spike

Testar:
- [ ] Tela de login aparece com design Kairos (cream, serif itálico, mono caps)
- [ ] Criar conta funciona (signup → email de confirmação → entrar)
- [ ] Login com conta existente funciona
- [ ] Após login, chega na placeholder Hoje
- [ ] Botão Sair desloga e volta pro Login

Se todos ok: continua pro Mo-03 em diante.
Se não: documentar o que falhou, ajustar, validar de novo.

## Mudanças pendentes no Vercel (depois do spike)

- Atualizar **Root Directory** do projeto Vercel de `/` pra `apps/web`.
- Redeploy.

Até isso ser feito, `foco-tdah-chi.vercel.app` pode quebrar (estrutura mudou).
Fazer isso imediatamente após este commit.

## Referências

- Expo Router v4 docs
- NativeWind 4 docs
- Supabase + React Native guide
