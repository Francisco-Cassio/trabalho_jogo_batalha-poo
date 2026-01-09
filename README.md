# ⚔️ Trabalho de Programação Orientada a Objetos (POO) - Jogo de Batalha

Este projeto simula um jogo de combate por turnos em console, desenvolvido em TypeScript, utilizando conceitos de Programação Orientada a Objetos como classes, herança, polimorfismo e encapsulamento.

---

## 👨‍💻 Autores

- **Francisco de Cássio da Silva Mourão Júnior**
- **Isaac de Jesus Santos**

---

## 🧱 Arquitetura do Projeto

O código-fonte está organizado em camadas para facilitar manutenção e evolução:

- `src/core`: lógica principal de batalha e controle do jogo

  - `batalha.ts`: orquestra o menu, turnos de combate, seleção de participantes e fluxo geral.
  - `batalhaCompleta.ts`: representa o resumo de uma batalha finalizada (participantes, ações, vencedor, datas).

- `src/domain`: classes que representam as entidades do jogo

  - `personagem.ts`: classe base com atributos de vida, ataque, defesa, dano causado, abates, etc.
  - Subclasses com habilidades e passivas específicas:
    - `guerreiro.ts`
    - `mago.ts`
    - `arqueiro.ts`
    - `barbaro.ts`
    - `reflexivo.ts`
    - `exausto.ts`
    - `eterno.ts`

- `src/shared`: componentes reutilizáveis
  - `acao.ts`: registra uma ação ocorrida na batalha (origem, alvo, tipo, dano, data/hora).
  - `ataqueNaoPermitidoException.ts`: exceção específica para ataques não permitidos.
  - `utils/`: funções utilitárias de sorteio e probabilidades.

---

## 🕹️ Funcionalidades do Jogo

O sistema oferece uma experiência de combate por turnos com foco em regras de negócio e estatísticas:

- **Sistema de Personagens com Classes Distintas**

  - Cada classe possui atributos base e comportamentos próprios (por exemplo, fúria do Guerreiro com pouca vida, ataques múltiplos do Arqueiro, reflexo de dano, cansaço do Exausto, imortalidade do Eterno).

- **Combate por Turnos com Seleção de Participantes**

  - Mínimo de dois personagens vivos para iniciar uma batalha.
  - Participantes são sorteados a cada rodada (atacante e defensor), respeitando restrições como ataques inválidos.

- **Log Detalhado de Ações (Linha do Tempo)**

  - Cada batalha finalizada gera um histórico completo com todas as ações realizadas, horário e participantes envolvidos.
  - Os logs são persistidos em arquivo JSON (`dados_log_historico.json`) e podem ser consultados posteriormente.

- **Resumo de Batalhas e Estatísticas**

  - Exibição das batalhas já concluídas com data, participantes, quantidade de ações e vencedor.
  - Estatísticas por personagem: dano total causado, número de abates e status final (vivo ou morto).

- **Sistema de Recuperação de Personagens**

  - Menu dedicado para recuperar vida dos personagens após as batalhas.
  - Possível recuperar um personagem específico por ID ou recuperar todos de uma vez.
  - A recuperação redefine a vida do personagem para 100, independentemente de ele estar vivo ou morto.
  - Há validações para casos sem personagens cadastrados ou quando todos já estão com vida cheia.

- **Persistência de Dados de Personagens**

  - Os personagens criados são salvos em arquivo JSON (`dados_personagens.json`), permitindo fechar e reabrir o jogo mantendo o progresso.

- **Interface em Console com Submenus**
  - Menu principal com opções claras de adicionar personagem, iniciar combate, consultar personagens, ver logs, ver resumo de batalhas e recuperar personagens.
  - Submenus oferecem opção explícita de voltar ao menu principal, melhorando a navegação.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

Certifique-se de ter o Node.js e o TypeScript instalados.

```bash
# Instalar TypeScript e ts-node (se necessário)
npm install -g typescript ts-node
```
