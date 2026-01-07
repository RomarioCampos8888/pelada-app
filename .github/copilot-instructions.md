## Instruções rápidas para agentes de código (Copilot)

Este repositório é uma aplicação frontend em React + Vite com Tailwind e empacotamento mobile via Capacitor. Use este documento para entender convenções, comandos e pontos importantes antes de editar código.

- **Visão geral:** entrada em `src/main.jsx`; estilos em `src/index.css` usando Tailwind; UI primitives em `src/components/ui`; domínio "Pelada" em `src/Components/Pelada`.

- **Comandos úteis (validados no package.json):**
  - **Dev:** `npm run dev` — roda Vite em desenvolvimento.
  - **Build web:** `npm run build` — gera a versão de produção (Vite).
  - **Preview:** `npm run preview` — preview estático do build.
  - **Gerar recursos mobile:** `npm run generate:resources` — usa `cordova-res` e sincroniza com Capacitor (útil antes de abrir o projeto Android).

- **Mobile / Android:**
  - O projeto inclui a pasta `android/` gerada por Capacitor.
  - Fluxo comum para testar no Android:
    1. `npm run build`
    2. `npx cap copy android` (ou use o script de sync acima)
    3. `npx cap open android` — abre no Android Studio.
  - Arquivos de build nativos estão sob `android/app/`.

- **Principais dependências / libs a conhecer:** `react`, `vite`, `tailwindcss`, `framer-motion`, `lucide-react`, `sonner`, `date-fns`, `class-variance-authority`, `tailwind-variants`, `@capacitor/*`.

- **Padrões e convenções do projeto:**
  - **UI primitives:** crie/estenda controles reutilizáveis em `src/components/ui` (ex.: `button.jsx`, `input.jsx`). Essas primitives mantêm consistência visual e acessibilidade.
  - **Componentes de domínio:** coloque funcionalidades do jogo em `src/Components/Pelada/*` (ex.: `GameTimer.jsx`, `QueueSection.jsx`). Nomes em PascalCase nessa pasta.
  - **Entidades / lógica pura:** modelos ficam em `src/Entities` (por exemplo `src/Entities/Player.js`). Extraia lógica testável para funções puras quando possível.
  - **Dois diretórios de componentes:** atenção — há `src/components` (UI primitives, lowercase) e `src/Components` (área de domínio, PascalCase). Escolha conforme o tipo do componente.
  - **Estilos:** use classes Tailwind; para variantes reutilizáveis, siga padrões com `tailwind-variants` e `class-variance-authority` já presentes.

- **Arquitetura / fluxos importantes:**
  - A aplicação é cliente-side; não há backend no repositório. Integrações externas devem ser verificadas antes de implementar.
  - Componentes transmitem estado via props; não há store global. Para estado compartilhado, prefira hooks locais ou Context API leve.

- **Arquivos-chave para orientações rápidas:**
  - `src/main.jsx` — ponto de entrada da aplicação.
  - `src/components/ui/*` — primitives de UI reutilizáveis.
  - `src/Components/Pelada/*` — componentes que implementam regras/fluxos do jogo.
  - `src/Entities/Player.js` — modelagem de jogador e lógica associada.
  - `package.json` — scripts úteis (`dev`, `build`, `preview`, `generate:resources`).

- **Boas práticas específicas do repo:**
  - Reutilize primitives de `src/components/ui` para novos controles visuais.
  - Mantenha lógica de domínio fora de componentes (mover para `src/Entities` quando fizer sentido).
  - Use `framer-motion` para animações já existentes — siga padrões de uso nos componentes atuais.

- **O que evitar / observar:**
  - `README.md` está desatualizado (conteúdo de Streamlit). Confie no código e neste documento para decisões de implementação.
  - Não misturar convenções de pasta sem razão — siga a convenção local da área que estiver alterando.

- **Ao abrir PRs / pedir alterações ao agente:**
  - Forneça: arquivos alvo, comportamento esperado, passos para reproduzir (ex.: fluxo da fila), e screenshots se for UI.
  - Se mudar a API de um componente primitive, atualize os usos em `src/Components/Pelada`.

Se quiser, eu posso adicionar exemplos de snippets (hooks, testes unitários para `src/Entities/Player.js`, ou um checklist de revisão para PRs). Diga qual área você prefere detalhar.
