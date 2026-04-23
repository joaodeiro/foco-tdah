# @kairos/mobile

App nativo iOS/Android via Expo. Consome Supabase + API routes da `apps/web`.

## Rodando no seu iPhone (Expo Go, 100% grátis)

### Pré-requisitos
- Node 20+ instalado no Mac
- pnpm: `npm i -g pnpm`
- App **Expo Go** instalado no iPhone (App Store, grátis)
- iPhone e Mac na **mesma rede Wi-Fi**

### Setup (primeira vez)

```bash
# Do root do monorepo
pnpm install

# Variáveis de ambiente
cp apps/mobile/.env.example apps/mobile/.env
# (os defaults já apontam para a mesma Supabase do projeto web)
```

### Iniciar dev server

```bash
pnpm mobile
```

Vai aparecer um QR code no terminal. **Abra a câmera do iPhone** (ou o Expo Go) e escaneie. O app carrega no Expo Go em ~10s.

Se iPhone e Mac não estiverem no mesmo Wi-Fi ou se a rede bloqueia LAN, rode em modo túnel:

```bash
pnpm mobile -- --tunnel
```

## Estrutura

```
apps/mobile/
├── app/
│   ├── _layout.tsx          # Root: fontes, splash, theming
│   ├── index.tsx            # Redirect baseado em auth
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── (app)/
│       ├── _layout.tsx      # Guard: só entra se autenticado
│       └── hoje.tsx         # Placeholder; portar depois
├── lib/
│   ├── supabase.ts          # Client com AsyncStorage
│   └── toast.ts             # Alert wrappers com translateError
├── tailwind.config.js       # NativeWind + paleta Kairos
├── app.json                 # Expo config + bundle ID
└── package.json
```

## Design system

Fontes e cores vêm de `@kairos/shared/theme` (monorepo package).

Utilitários Tailwind via **NativeWind 4**. Classes como `bg-background`,
`text-ink`, `font-serif`, `font-mono` funcionam identicamente ao web.

## Scripts

| Comando | Efeito |
|---|---|
| `pnpm mobile` | Inicia Expo dev server |
| `pnpm mobile -- --tunnel` | Dev server via tunnel (rede flaky) |
| `pnpm mobile -- --clear` | Limpa cache Metro |

## Status

**Spike de 2 dias**: Login + Signup + placeholder Hoje.

Próxima onda (se spike validar): portar Tarefas, Diário, Perfil, TimerModal,
ChatSheet. A fila completa tá em `docs/releases/kairos-mobile-port.md` (a criar).
