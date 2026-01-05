# pelada-app
App para organizar as partidas de futebol com controle dos próximos jogadores


Claro, Romário! Vou te descrever toda a lógica de funcionamento do app de forma estruturada, como se fosse um guia de projeto. Assim, mesmo sem olhar o código, você conseguiria recriá‑lo do zero.

🏗️ Estrutura geral do app
O app é feito em Streamlit e tem como objetivo organizar partidas de futebol entre amigos, controlando:
- Cadastro de jogadores
- Distribuição inicial em dois times
- Fila de substituições
- Controle de tempo da partida
- Registro do resultado (vitória/empate) e atualização dos times

🔑 Estados e variáveis principais
O app usa st.session_state para manter dados entre interações. Principais variáveis:
- tela: controla qual tela está ativa (1 = cadastro, 2 = partida, 3 = resultado).
- jogadores: lista de todos os jogadores cadastrados.
- qtd_por_time: número de jogadores por time.
- minutos_partida: duração da partida.
- fila: jogadores que aguardam para entrar.
- time_a e time_b: listas com os jogadores de cada time.
- inicio_partida e fim_partida: horários da partida.
- partida_ativa: indica se a partida está em andamento.
- Variáveis de confirmação (confirm_remove, confirm_team, confirm_index) para remoções/substituições.

📱 Telas e fluxo
Tela 1 – Cadastro
- Usuário adiciona jogadores manualmente ou importa lista.
- Pode remover jogadores da lista.
- Define quantidade de jogadores por time e duração da partida.
- Ao clicar em “Organizar Futebol”, os jogadores são embaralhados e distribuídos:
- Primeiros qtd_por_time vão para Time A.
- Próximos qtd_por_time vão para Time B.
- Restante vai para a fila.
- Avança para Tela 2.

Tela 2 – Partida em andamento
- Mostra Time A e Time B lado a lado.
- Cada jogador tem botão ➖ para remoção:
- Ao remover, jogador vai para a fila.
- É substituído pelo próximo da fila.
- Controle de tempo:
- Botão “Iniciar Partida” registra horário inicial e calcula fim previsto.
- Mostra início e fim.
- Quando tempo acaba, toca alerta sonoro.
- Botão “Encerrar” leva para Tela 3.
- Adição de novos jogadores à fila durante a partida.
- Exibição da fila em blocos do tamanho de um time, com opção de remover jogadores da fila.

Tela 3 – Resultado da Partida
- Usuário escolhe se houve empate ou quem perdeu.
- Se empate:
- Pergunta preferência (Time A ou B).
- Atualiza fila e reorganiza times conforme lógica de prioridade.
- Se vitória:
- Perdedor vai para fila.
- Time perdedor é reposto com novos jogadores da fila.
- Botão “Encerrar Futebol” limpa estados e volta para Tela 1.

⚙️ Funções utilitárias
- init_state(): inicializa variáveis no session_state.
- distribuir_inicial(): embaralha jogadores e distribui em times + fila.
- repor_time_from_fila(time_key, index=None): repõe jogador removido ou recria time inteiro a partir da fila.

🎨 Estilo e UX
- CSS customizado para:
- Fundo cinza claro.
- Botões verdes arredondados.
- Cartões coloridos para Time A (verde), Time B (azul) e fila (cinza).
- Mensagens de sucesso/alerta com cores suaves.
- Responsividade para celular (ajuste de fonte, botões maiores).
- Ajustes de layout para manter nome + botão ➖ na mesma linha.

🔄 Fluxo resumido
- Cadastro → adiciona jogadores → define parâmetros → distribui times.
- Partida → controla tempo → substituições → fila dinâmica → encerra.
- Resultado → registra empate/vitória → reorganiza times → opção de encerrar tudo.

👉 Com essa descrição, você consegue recriar o app: basta pensar em três telas controladas por uma variável de estado, listas para jogadores/times/fila, funções para embaralhar e repor, e CSS para deixar bonito e responsivo.

Quer que eu monte um fluxograma visual (em texto ou gráfico) mostrando o caminho entre as telas e as ações possíveis? Isso ajuda muito a visualizar a lógica completa.
