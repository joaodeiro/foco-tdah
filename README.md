# Kairos

Produtividade para o cérebro TDAH 2e. Monorepo.

```
apps/
  web/        Next.js (LP + API routes + PWA legada)
  mobile/     Expo (produto principal, spike em andamento)

packages/
  shared/     types, theme, tradução de erros
```

## Primeiro setup

```bash
npm i -g pnpm
pnpm install
```

## Rodar

```bash
pnpm web          # Next dev em apps/web
pnpm mobile       # Expo dev server em apps/mobile
```

Pra rodar o mobile no iPhone: siga `apps/mobile/README.md`. Precisa do app
**Expo Go** no iPhone e Mac na mesma rede Wi-Fi.

## Releases

- `docs/releases/kairos-focus.md` — concluída (PWA)
- `docs/releases/kairos-palace.md` — planejada (retoma após mobile)
- `docs/releases/kairos-mobile-port.md` — em andamento (spike)

## Backlog atual

Ver todos vigentes no topo do chat / TodoWrite.

## Infra

- **Supabase**: único projeto, compartilhado web e mobile
- **Vercel**: hosta `apps/web` (inclui API routes que o mobile consome)
- **Expo Go**: runtime do mobile em dev e uso pessoal (free)
