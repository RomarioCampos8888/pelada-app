## Instruções rápidas para agentes de código (Copilot)

Este repositório é uma aplicação frontend em React + Vite com Tailwind. Use este documento para entender convenções, comandos e pontos importantes do projeto antes de alterar código.

- **Visão geral:** entrada em `src/main.jsx` via Vite; estilos em `index.css` usando Tailwind; componentes estão em `src/components` e `src/Components` (veja nota sobre pastas duplicadas abaixo). Funcionalidade principal relacionada a "pelada" está em `src/Components/Pelada`.

- **Comandos úteis:**
  - Desenvolvimento: `npm run dev` (inicia Vite localmente)
  - Build: `npm run build`
  - Preview: `npm run preview`

- **Dependências importantes:** `react`, `vite`, `tailwindcss`, `framer-motion`, `lucide-react`, `sonner`, `date-fns`, `class-variance-authority`, `tailwind-variants`.

- **Arquitetura / padrões:**
  - UI: pequena biblioteca de primitives em `src/components/ui` (ex.: `button.jsx`, `input.jsx`, `label.jsx`, `radio-group.jsx`, `slider.jsx`, `textarea.jsx`). Reutilize essas primitives para manter consistência de estilos e acessibilidade.
  - Área de domínio "Pelada": `src/Components/Pelada/*` contém `ConfirmDialog.jsx`, `GameTimer.jsx`, `PlayerCard.jsx`, `QueueSection.jsx`, `TeamCard.jsx`. Essas componentes orquestram fluxo de jogo/filas.
  - Entidades: `src/Entities/Player.js` contém a modelagem de jogador. Prefira transformar lógica complexa de estado em funções puras reutilizáveis embora ainda mantenha UI em componentes React.

- **Convensões do projeto:**
  - Nomes de arquivos de componentes React usam PascalCase quando na pasta `Components/` e lowercase/short-names em `components/ui`. Observe a existência de duas pastas c/ convenções diferentes — verifique qual pasta o recurso deve viver antes de criar novos arquivos.
  - Estilos: use classes Tailwind; quando precisar de variantes reutilizáveis, use `tailwind-variants` e `class-variance-authority` como no código existente.
  - Efeitos/Animações: use `framer-motion` para animações de componentes já existentes.

- **Padrões de interação entre componentes:**
  - Os componentes principais da Pelada delegam estado para componentes filhos via props; não há um gerenciador global óbvio (Redux/MobX). Se precisar de estado compartilhado, prefira hooks locais ou Context API leve.

- **Integrações externas:**
  - Bibliotecas de UI: `lucide-react` para ícones; `sonner` para toasts/feedback.
  - Sem backend explícito no repositório: verifique se integrações externas (API) existem fora do repositório antes de implementá-las.

- **O que evitar/observar:**
  - `README.md` contém conteúdo que parece ser de um projeto Streamlit Python — está desatualizado em relação ao código atual. Não confie em seu conteúdo para arquitetura do frontend; priorize o código em `src/`.
  - Há duas pastas similares: `src/components` e `src/Components`. Antes de criar um novo componente, confirme qual convenção a base do projeto espera para a área que você está mudando.

- **Exemplos específicos para alterações:**
  - Para alterar a inicialização, edite `src/main.jsx`.
  - Para novos componentes de UI reutilizáveis, adicione em `src/components/ui` seguindo os patterns existentes (`button.jsx` e `input.jsx`).
  - Para lógica de jogo (fila, substituições, timer), prefira modificar/estender `src/Components/Pelada/*` e `src/Entities/Player.js`.

- **Solicitações ao agente:**
  - Ao pedir mudanças, inclua: arquivo(s) alvo, comportamento esperado, e exemplo de entrada/saída se for lógica (ex.: como a fila deve se comportar ao remover um jogador).

Se precisar, atualizo este arquivo com exemplos de código ou decisões de arquitetura mais profundas — diga quais áreas você quer detalhar (ex.: fluxo de estado do timer, modelagem de jogador, ou convenções CSS).
