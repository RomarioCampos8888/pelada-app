## Checklist de PR (pelada-app)

Antes de abrir/mergear, confirme os pontos abaixo:

- [ ] **Arquitetura:** Mudanças respeitam a separação `src/components/ui/*` (primitives) vs `src/Components/Pelada/*` (domínio) e mantêm `Home.jsx` como fonte de verdade.
- [ ] **Estado/Persistência:** Atualizou leituras/escritas de `localStorage` (`pelada_*`) em `Home.jsx` quando adicionou/alterou estados relacionados.
- [ ] **Players como strings:** Se tocou `players`, manteve o formato `string` ou adicionou conversões consistentes onde necessário (cadastro e componentes). `src/Entities/Player.js` segue não utilizado.
- [ ] **Fluxos da partida:** Regras de empate/vitória e distribuição inicial continuam centralizadas em `Home.jsx` (`distributeInitial`, reordenação de fila/times).
- [ ] **Component APIs:** Ao mudar props/callbacks (`onRemove`, `onAddPlayer`, `onRemovePlayer`), atualizou usos em `TeamCard.jsx`, `PlayerCard.jsx` e `QueueSection.jsx`.
- [ ] **UI/Estilo:** Reutilizou primitives (`button`, `input`, `slider`, `radio-group`) e Tailwind; evitou CSS inline complexo.
- [ ] **PWA:** `vite-plugin-pwa` continua registrado em `src/main.jsx` (`virtual:pwa-register`); não quebrou o fluxo `registerType: autoUpdate`.
- [ ] **Android (se aplicável):** Gerou recursos com `npm run generate:resources` e sincronizou com `npx cap sync android`. Config permanece em `capacitor.config.json`.
- [ ] **Build local:** `npm ci && npm run build` executam sem erros; se relevante, testou `npm run preview`.
- [ ] **Referências/Imports:** Usou alias `@` para `src` conforme `vite.config.js`.

### Notas de teste manual

- [ ] Cadastro: adicionar/remover jogadores, definir `playersPerTeam` e `matchDuration`, validar `distributeInitial()` (times + fila).
- [ ] Partida: timer (`GameTimer`) inicia/pausa/encerra corretamente; substituições via fila funcionam; blocos da `QueueSection` respeitam `playersPerTeam`.
- [ ] Resultado: empate com preferência reordena sem desequilibrar; vitória envia perdedor à fila e repõe corretamente.

### Links úteis

- `src/Pages/Home.jsx` — orquestra estados/persistência/regras.
- `src/Components/Pelada/GameTimer.jsx` — timer e pausa.
- `src/Components/Pelada/QueueSection.jsx` — fila por blocos.
- `vite.config.js` — alias `@`, PWA.
