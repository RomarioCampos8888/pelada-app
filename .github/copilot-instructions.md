## Instruções práticas para agentes de código (Copilot)

Este projeto é uma SPA em React + Vite com Tailwind, PWA via `vite-plugin-pwa` e empacotamento Android com Capacitor. Foque em produtividade imediata com estes pontos-chave.

- **Arquitetura (big picture):**
  - Entrada em `src/main.jsx` (React.StrictMode + registro PWA `virtual:pwa-register`). Alias `@` aponta para `src` (ver `vite.config.js`).
  - Sem store global: `src/Pages/Home.jsx` é a única fonte de verdade; estado flui por props. Decisão prioriza simplicidade, previsibilidade e persistência local para uso offline/mobile.
  - Separação de camadas: primitives em `src/components/ui/*`; domínio da pelada em `src/Components/Pelada/*` (PascalCase).

- **Estado e dados:**
  - Persistência em `localStorage` com prefixo `pelada_*` (ex.: `pelada_players`, `pelada_teamA`, `pelada_queue`, `pelada_isMatchActive`), lido/escrito via `useEffect` em `Home.jsx`.
  - `players` são strings (nomes). `src/Entities/Player.js` não é usado hoje; se evoluir para objetos, alinhe cadastro e componentes para converter corretamente.

- **Fluxo funcional (3 telas):**
  - Cadastro: adiciona jogadores (manual/lista), define `playersPerTeam` e `matchDuration`; distribuição inicial feita por `distributeInitial()` (Time A/B + fila).
  - Partida: `GameTimer` controla tempo (usa `date-fns`; pausa ajusta `adjustedEndTime`; apito base64 ao terminar). `TeamCard`/`PlayerCard` variam por `variant` (`teamA`, `teamB`, `queue`). `QueueSection` organiza a `queue` em blocos de `playersPerTeam` e expõe `onAddPlayer`/`onRemovePlayer`.
  - Resultado: empate com preferência (mantém equilíbrio), vitória envia perdedor à fila. Regras de reordenação estão centralizadas em `Home.jsx`.

- **Padrões de componentes:**
  - Primitives (`button.jsx`, `input.jsx`, `slider.jsx`, `radio-group.jsx`) são simples e reutilizáveis; estilize com Tailwind e evite CSS inline complexo.
  - Interações propagam via callbacks: `onRemove`, `onRemovePlayer`, `onAddPlayer` (veja `TeamCard.jsx`, `PlayerCard.jsx`, `QueueSection.jsx`).

- **Workflows de desenvolvimento:**
  - Dev: `npm run dev` (Vite em 5173, `host: true`). Build web: `npm run build`. Preview: `npm run preview` (4173).
  - Recursos Android: `npm run generate:resources` (ícones/splash) e `npx cap sync android`. Abrir projeto nativo: `npx cap open android`. Config em `capacitor.config.json`; código nativo em `android/app/`.

- **Integrações e libs:**
  - `framer-motion` (animações), `lucide-react` (ícones), `sonner` (toasts), `date-fns` (datas). PWA com `vite-plugin-pwa` (`registerType: autoUpdate`; manifest e configuração em `vite.config.js`).

- **Convenções locais:**
  - `src/components` (lowercase, primitives) vs `src/Components` (PascalCase, domínio). Use o alias `@` nos imports.
  - Ao mudar APIs de componentes, atualize usos em `src/Pages/Home.jsx` e `src/Components/Pelada/*`.
  - README raiz está desatualizado (Streamlit); confie neste guia e no código.

- **Dicas de debug:**
  - Timer/pausa: veja `src/Components/Pelada/GameTimer.jsx` (cálculo de `adjustedEndTime` e término).
  - Fila/times: veja `src/Components/Pelada/QueueSection.jsx` (blocos por `playersPerTeam`) e `src/Components/Pelada/TeamCard.jsx`.
  - Mobile: `src/hooks/useWakeLock.js` mantém a tela ativa durante a partida.

- **Referências rápidas:**
  - `src/Pages/Home.jsx` (estados, persistência e regras).
  - `src/Components/Pelada/GameTimer.jsx` (timer e pausa).
  - `src/Components/Pelada/QueueSection.jsx` (fila por blocos).
  - `vite.config.js` (alias `@`, PWA, portas).

### Exemplos curtos

- Wake Lock (mobile):

```jsx
import { useWakeLock } from '@/hooks/useWakeLock'

export function MatchView() {
  useWakeLock();
  // ... render de TeamCard, GameTimer e QueueSection
}
```

- RadioGroup (primitives):

```jsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

<RadioGroup value={preference} onValueChange={setPreference}>
  <RadioGroupItem value="teamA" />
  <RadioGroupItem value="teamB" />
</RadioGroup>
```

Se algo estiver pouco claro ou faltar um fluxo específico, me diga o que complementar (ex.: regras detalhadas de empate/vitória, sequência de distribuição inicial, ou checklist para alterações em `Home.jsx`).
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
