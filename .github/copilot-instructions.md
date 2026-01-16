## Instruções rápidas para agentes de código (Copilot)

Este repo é uma SPA em React + Vite com Tailwind e empacotamento mobile via Capacitor. Abaixo, o essencial para agir com segurança e produtividade neste código.

- **Arquitetura e entrada:**
  - `src/main.jsx` inicializa a app, aplica `React.StrictMode` e registra PWA via `virtual:pwa-register` (plugin `vite-plugin-pwa`). Alias `@` aponta para `src` (ver `vite.config.js`).
  - UI primitives em `src/components/ui/*` (controles simples: `button.jsx`, `input.jsx`, `slider.jsx`, `radio-group.jsx`). Domínio “Pelada” em `src/Components/Pelada/*` (PascalCase).
  - Estilos globais em `src/index.css` com Tailwind; classe utilitária `scrollbar-none` já definida.

- **Estado e dados (importante):**
  - Não há store global. O estado vive em `src/Pages/Home.jsx` e flui via props para componentes.
  - Persistência no `localStorage` com chaves prefixadas `pelada_*` (ex.: `pelada_players`, `pelada_teamA`, `pelada_queue`, `pelada_isMatchActive`). Leitura/escrita feita por múltiplos `useEffect` em `Home.jsx`.
  - `players` são strings (nomes). O arquivo `src/Entities/Player.js` é um schema simples e não é utilizado atualmente; se evoluir para objetos, alinhe conversões no cadastro e nos componentes.

- **Fluxo funcional (3 telas):**
  - Tela 1 (Cadastro): adiciona jogadores (manual ou lista), define `playersPerTeam` e `matchDuration`; distribui times e fila via `distributeInitial()`.
  - Tela 2 (Partida): exibe `TeamCard` A/B, controla tempo com `GameTimer` (pausa ajusta `endTime`), gerencia `QueueSection` em blocos do tamanho do time.
  - Tela 3 (Resultado): registra empate/vitória e reordena times/fila conforme lógica em `Home.jsx` (preferência no empate; perdedor vai para fila na vitória).

- **Componentes de domínio (padrões):**
  - `GameTimer.jsx`: usa `date-fns` e ajusta `adjustedEndTime` ao pausar; apito base64 ao terminar.
  - `QueueSection.jsx`: divide `queue` em blocos (`playersPerTeam`) e expõe `onAddPlayer`/`onRemovePlayer`.
  - `TeamCard.jsx` e `PlayerCard.jsx`: variam estilo por `variant` (`teamA`, `teamB`, `queue`) e propagam `onRemove`/`onRemovePlayer`.
  - Hook `src/hooks/useWakeLock.js`: mantém tela ativa; considere usar junto ao timer em contextos mobile.

- **Comandos e execução (validados):**
  - Dev: `npm run dev` (Vite em `5173`, `host: true`).
  - Build web: `npm run build` (saída em `dist`). Preview: `npm run preview` (`4173`).
  - Mobile assets: `npm run generate:resources` (gera ícones/splash e `npx cap sync android`).

- **Android (Capacitor):**
  - `capacitor.config.json` define `appId/appName/webDir`.
  - Fluxo típico: `npm run build` → `npx cap copy android` (ou `sync` via script) → `npx cap open android`. Código nativo em `android/app/`.

- **Integrações e libs:**
  - `framer-motion` para animações; `lucide-react` ícones; `sonner` toasts; `date-fns` formatação.
  - PWA via `vite-plugin-pwa` com `registerType: autoUpdate` e manifest em `vite.config.js`.

- **Convenções e cuidados:**
  - Respeite os dois diretórios de componentes: `src/components` (primitives, lowercase) vs `src/Components` (domínio, PascalCase).
  - Reutilize primitives; evite estilos inline complexos — prefira Tailwind.
  - README atual está desatualizado (Streamlit). Confie neste documento e no código.
  - Ao mudar APIs de componentes, atualize chamadas em `src/Pages/Home.jsx` e `src/Components/Pelada/*`.

- **Pontos de referência úteis:**
  - `src/Pages/Home.jsx` (orquestra estados, persistência e regras).
  - `src/Components/Pelada/GameTimer.jsx` (timer e pausa).
  - `src/Components/Pelada/QueueSection.jsx` (fila por blocos).
  - `vite.config.js` (alias `@`, PWA, portas).

Se quiser, posso adicionar exemplos de snippets (uso de `useWakeLock`, padrão de `RadioGroup`, ou um checklist para revisar mudanças em `Home.jsx`). Diga o que prefere detalhar.
