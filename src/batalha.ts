import { Personagem } from "./personagem";
import { Acao } from "./acao";
import { Guerreiro } from "./guerreiro";
import { Mago } from "./mago";
import { Arqueiro } from "./arqueiro";
import { Barbaro } from "./barbaro";
import { Reflexivo } from "./reflexivo";
import { Exausto } from "./exausto";
import { Eterno } from "./eterno";
import { AtaqueNaoPermitidoException } from "./ataqueNaoPermitidoException";
import { BatalhaCompleta } from "./batalhaCompleta";
import { acertoEventoProbabilidade, sorteio } from "./utils/utils";
import prompt from "prompt-sync";
import * as fs from "fs";

class Batalha {
  private _personagens: Personagem[];
  private _acoesTemporarias: Acao[];
  private _logHistorico: BatalhaCompleta[];
  private input = prompt();
  private NOME_ARQUIVO = "dados_personagens.json";
  private NOME_LOG = "dados_log_historico.json";

  constructor() {
    this._personagens = [];
    this._acoesTemporarias = [];
    this._logHistorico = [];
  }

  public menu(): void {
    let opcao: string = "";
    let opcaoPersonagem: string = "";
    let id: number =
      this.personagens.length > 0
        ? Math.max(...this.personagens.map((p) => p.id)) + 1
        : 1;

    let nome: string = "";
    let atacante: Personagem;
    let defensor: Personagem;

    this.carregarDados();
    this.carregarLogHistorico();
    if (this.personagens.length > 0) {
      id = Math.max(...this.personagens.map((p) => p.id)) + 1;
    }

    console.clear();
    do {
      console.log("\n⚔️ ======== ARENA DE BATALHA ======== 🛡️\n");
      console.log(" 1 - Adicionar Personagem 👤");
      console.log(" 2 - Iniciar Turno de Combate 🥊");
      console.log(" 3 - Verificar Personagens 👥");
      console.log(" 4 - Logs de Ações (Linha do Tempo) 📜");
      console.log(" 5 - Resumo do Histórico de Batalhas 🏆");
      console.log(" 6 - Reviver Personagem ✨");
      console.log("\n 0 - Sair da Aplicação");
      console.log("\n======================================\n");
      opcao = this.input("➡️ Opção: ");
      console.clear();
      try {
        switch (opcao) {
          case "1":
            console.log("\n⚔️ ======== ADICIONAR PERSONAGEM ======== 🛡️");
            console.log(
              "\nSeu personagem será:\n\n 1 - Guerreiro 🛡️\n 2 - Mago 🔮\n 3 - Arqueiro 🏹\n 4 - Bárbaro 🪓\n 5 - Reflexivo 🪞\n 6 - Exausto 💤\n 7 - Eterno ♾️\n"
            );
            opcaoPersonagem = this.input("➡️ Opção: ");
            switch (opcaoPersonagem) {
              case "1":
                nome = this.input("✉️ Nome: ");
                const guerreiro: Guerreiro = new Guerreiro(id, nome);
                this.adicionarPersonagem(guerreiro);
                console.log(`\n✅ Guerreiro ${nome} adicionado!`);
                break;
              case "2":
                nome = this.input("✉️ Nome: ");
                const mago: Mago = new Mago(id, nome);
                this.adicionarPersonagem(mago);
                console.log(`\n✅ Mago ${nome} adicionado!`);
                break;
              case "3":
                nome = this.input("✉️ Nome: ");
                const arqueiro: Arqueiro = new Arqueiro(id, nome);
                this.adicionarPersonagem(arqueiro);
                console.log(`\n✅ Arqueiro ${nome} adicionado!`);
                break;
              case "4":
                nome = this.input("✉️ Nome: ");
                const barbaro: Barbaro = new Barbaro(id, nome);
                this.adicionarPersonagem(barbaro);
                console.log(`\n✅ Bárbaro ${nome} adicionado!`);
                break;
              case "5":
                nome = this.input("✉️ Nome: ");
                const reflexivo: Reflexivo = new Reflexivo(id, nome);
                this.adicionarPersonagem(reflexivo);
                console.log(`\n✅ Reflexivo ${nome} adicionado!`);
                break;
              case "6":
                nome = this.input("✉️ Nome: ");
                const exausto: Exausto = new Exausto(id, nome);
                this.adicionarPersonagem(exausto);
                console.log(`\n✅ Exausto ${nome} adicionado!`);
                break;
              case "7":
                nome = this.input("✉️ Nome: ");
                const eterno: Eterno = new Eterno(id, nome);
                this.adicionarPersonagem(eterno);
                console.log(`\n✅ Eterno ${nome} adicionado!`);
                break;
              default:
                console.log("\n❌ Opção de classe inválida.");
                break;
            }
            id++;
            break;

          case "2":
            if (this.personagens.length < 2) {
              console.log(
                "\n❌ Mínimo de 2 personagens são necessários para iniciar combate."
              );
              break;
            }

            console.log("\n=============================================\n");

            const participantesGeraisVivos = this.personagens.filter((p) =>
              p.estaVivo()
            );

            if (participantesGeraisVivos.length < 2) {
              console.log(
                "\n❌ Mínimo de 2 personagens vivos são necessários."
              );
              break;
            }

            console.log("📋 STATUS ATUAL DE TODOS OS PERSONAGENS:\n");
            this.personagens.forEach((p) => {
              const status = p.estaVivo() ? "💙 VIVO" : "❌ MORTO";
              console.log(
                `  • ${p.id} - ${p.nome} (${p.constructor.name}): ${p.vida} vida ${status}`
              );
            });
            console.log("\n=============================================");

            const participantes = this.selecionarParticipantes();
            if (participantes.length < 2) break;

            participantes.forEach((p) => {
              p.ataqueBase = p.ataqueBaseInicial;
            });

            this.acoesTemporarias = [];
            console.clear();
            console.log(
              "\n==============🔥 INICIANDO COMBATE 🔥=============="
            );

            console.log(`\n🤺 Jogadores:\n`);
            participantes.forEach((p) => {
              console.log(`  • ${p.nome} (${p.constructor.name})`);
            });
            console.log("\n==================================================");
            this.input("\n➡️ <Enter> para iniciar o turno.");
            console.clear();

            while (participantes.filter((p) => p.estaVivo()).length > 1) {
              console.log(
                `\n============== ⚔️ RODADA DE COMBATE ⚔️ ==============`
              );
              const vivosAtuais = participantes.filter((p) => p.estaVivo());

              if (vivosAtuais.length < 2) {
                break;
              }
              const combatentes = this.sortearCombatentes(vivosAtuais);
              atacante = combatentes[0];
              defensor = combatentes[1];

              try {
                this.turno(atacante.id, defensor.id);
              } catch (erro) {
                if (erro instanceof AtaqueNaoPermitidoException) {
                  console.log(`\n${erro.message}`);
                } else {
                  throw erro;
                }
              }

              console.log(`\n👤 Situação Atual:\n`);
              participantes.forEach((p) => {
                if (!p.estaVivo()) {
                  console.log(`  • ${p.nome}: ${p.vida} vida ❌ morto(a)`);
                } else {
                  console.log(`  • ${p.nome}: ${p.vida} vida 💙`);
                }
              });
              console.log(
                "\n=================================================="
              );
              this.input("\n➡️ <Enter> para avançar o turno.");
              console.clear();
            }
            const vencedor = this.verificarVencedor(participantes);
            const novaBatalha = new BatalhaCompleta(
              this.logHistorico.length + 1,
              participantes,
              [...this.acoesTemporarias],
              vencedor || null
            );
            this.logHistorico.push(novaBatalha);
            this.acoesTemporarias = [];
            this.salvarLogHistorico();

            console.log("\n=========== ❌ FIM DA BATALHA ❌ ===========");

            this.gerarResumoBatalha(participantes, true);

            break;

          case "3":
            console.log("\n==============================================");

            if (this.personagens.length === 0) {
              console.log(
                "\n❌ Não há personagens criados. Adicione personagens."
              );
              break;
            }
            console.log("\n📋 LISTA DE PERSONAGENS:\n");
            this.personagens.forEach((p) => {
              const status = p.estaVivo() ? "💙 VIVO" : "❌ MORTO";
              console.log(
                `👤 ${p.id} - ${p.nome} (${p.constructor.name}) ${status}`
              );
            });

            console.log("\n🔎 Digite o nome para ver atributos: ");
            const nomeBusca = this.input("➡️ ").toLocaleLowerCase();
            console.log("\n==============================================");

            const personagemEncontrado = this.consultarPersonagem(nomeBusca);

            console.log("\n📋 STATUS DO PERSONAGEM:\n");
            console.log(personagemEncontrado.toString());
            break;

          case "4":
            console.log(
              "\n📜 ========= LOG DE AÇÕES (SELECIONE A BATALHA) ========= 📜"
            );

            if (this.logHistorico.length === 0) {
              console.log("\n❌ Nenhuma batalha finalizada registrada.");
              break;
            }

            console.log("\n📋 BATALHAS FINALIZADAS:\n");
            this.logHistorico.forEach((b) => {
              const vencedorNome = b.vencedor
                ? b.vencedor.nome
                : "Ninguém (Empate)";
              console.log(
                `[${
                  b.id
                }] - Data: ${b.dataFim.toLocaleString()} | Vencedor: ${vencedorNome} | Ações: ${
                  b.acoes.length
                }`
              );
            });

            console.log("");
            const idBusca = this.input(
              "➡️ Digite o ID da batalha para ver a Linha do Tempo: "
            );
            const idBatalha = parseInt(idBusca);

            if (isNaN(idBatalha)) {
              console.log("\n❌ ID inválido.");
              break;
            }

            const batalhaSelecionada = this.logHistorico.find(
              (b) => b.id === idBatalha
            );

            if (!batalhaSelecionada) {
              console.log(`\n❌ Batalha com ID ${idBatalha} não encontrada.`);
              break;
            }
            console.clear();
            console.log(
              "\n================================================================="
            );
            console.log(
              `\n📄 BATALHA ID ${batalhaSelecionada.id} - LINHA DO TEMPO:`
            );
            batalhaSelecionada.acoes.forEach((acao, index) => {
              console.log(`\n➡️ AÇÃO ${index + 1}:`);
              console.log(
                `⏱️ Tempo: ${acao.dataHora.toLocaleTimeString("pt-BR")}`
              );
              console.log(acao.toString());
            });
            console.log(
              "\n================================================================="
            );
            break;

          case "5":
            console.log(
              "\n🏆 ========= RESUMO DO HISTÓRICO DE BATALHAS ========= 🏆"
            );

            if (this.logHistorico.length === 0) {
              console.log("\n❌ Nenhuma batalha finalizada registrada.");
              break;
            }

            this.logHistorico.forEach((b) => {
              const vencedorNome = b.vencedor
                ? b.vencedor.nome
                : "Ninguém (Empate)";
              const participantesNomes = b.participantes
                .map((p) => p.nome)
                .join(", ");

              console.log(`\n============== BATALHA ${b.id} ===============\n`);
              console.log(`Data: ${b.dataFim.toLocaleString()}`);
              console.log(`Participantes: ${participantesNomes}`);
              console.log(`Total de Ações: ${b.acoes.length}`);
              console.log(`Vencedor: ${vencedorNome}`);
              console.log("\n==============================================");
            });
            break;

          case "6":
            console.log("\n✨ ======== OPÇÕES DE RESSURREIÇÃO ======== ✨\n");
            console.log(" 1 - Reviver Personagem Individual (por ID)");
            console.log(" 2 - Reviver TODOS os Personagens Mortos");
            console.log(" 0 - Voltar ao Menu Principal\n");

            const subOpcaoReviver = this.input("➡️ Opção: ");

            switch (subOpcaoReviver) {
              case "1":
                const mortos = this.personagens.filter((p) => !p.estaVivo());

                if (mortos.length === 0) {
                  console.log(
                    "\n❌ Não há personagens mortos para reviver individualmente."
                  );
                  break;
                }

                console.log("\n💀 Personagens Mortos:\n");
                mortos.forEach((p) => console.log(`  • ID ${p.id}: ${p.nome}`));

                const idReviverStr = this.input(
                  "\n➡️ Digite o ID do personagem que deseja reviver: "
                );
                const idReviver = parseInt(idReviverStr);

                if (isNaN(idReviver)) {
                  throw new Error("ID inválido. Por favor, digite um número.");
                }

                this.reviverPersonagem(idReviver);
                break;

              case "2":
                this.reviverTodosPersonagens();
                break;

              case "0":
                console.log("\nVoltando ao Menu Principal...");
                break;

              default:
                console.log("\n❌ Opção inválida no menu de Ressurreição!");
            }
            break;

          case "0":
            this.salvarDados();
            this.salvarLogHistorico();
            break;

          default:
            console.log("\n❌ Opção inválida!");
        }
      } catch (error: any) {
        console.log(`\n❌ ERRO: ${error.message}`);
      }
      this.input("\n☑️ Pressione <Enter> para continuar.");
      console.clear();
    } while (opcao != "0");

    console.log("\n👋 Aplicação encerrada. Volte sempre!");
  }

  private selecionarParticipantes(): Personagem[] {
    const personagensVivos = this.personagens.filter((p) => p.estaVivo());

    console.log("\n👥 Escolha os personagens para a batalha:\n");

    personagensVivos.forEach((p) =>
      console.log(`${p.id} - ${p.nome} (${p.constructor.name})`)
    );

    console.log(
      "\n🏷️ Digite:\n- IDs separados por vírgula (ex: 1,2).\n- <Enter> para selecionar todos.\n- '0' para cancelar.\n"
    );

    const idsEscolhidos = this.input("➡️ Opção: ");

    if (idsEscolhidos.trim() === "0") return [];

    if (!idsEscolhidos.trim()) {
      return personagensVivos;
    }

    const participantes: Personagem[] = [];
    const ids = idsEscolhidos.split(",");

    for (const item of ids) {
      const itemTrimmed = item.trim();
      const id = parseInt(itemTrimmed);

      if (isNaN(id) || !itemTrimmed) {
        throw new Error(
          `O valor digitado '${
            itemTrimmed || "Vazio"
          }' não é um ID numérico válido.`
        );
      }

      const p = personagensVivos.find((personagem) => personagem.id === id);

      if (!p) {
        const pGeral = this.personagens.find(
          (personagem) => personagem.id === id
        );
        if (pGeral && !pGeral.estaVivo()) {
          throw new Error(
            `Personagem com ID ${id} (${pGeral.nome}) está morto e não pode ser selecionado.`
          );
        }
        throw new Error(`Personagem com ID ${id} não encontrado ou inválido.`);
      }

      if (!participantes.includes(p)) participantes.push(p);
    }

    if (participantes.length < 2) {
      throw new Error(
        "Seleção inválida. Mínimo de 2 personagens são necessários."
      );
    }
    console.clear();
    return participantes;
  }

  public consultarId(id: number): Personagem {
    return this.personagens.find((p) => p.id === id)!;
  }

  public adicionarPersonagem(p: Personagem): void {
    const nomeExistente = this.personagens.some(
      (personagem) =>
        personagem.nome.toLocaleLowerCase() === p.nome.toLocaleLowerCase()
    );
    if (nomeExistente) {
      throw new Error(
        `\n❌ Personagem com nome '${p.nome}' já existe. Escolha outro nome.`
      );
    }

    this.personagens.push(p);
  }

  private consultarPersonagem(nome: string): Personagem {
    const personagemEncontrado = this.personagens.find(
      (p) => p.nome.toLocaleLowerCase() === nome.toLocaleLowerCase()
    );

    if (!personagemEncontrado) {
      throw new Error(`\n❌ Personagem com nome '${nome}' não encontrado.`);
    }

    return personagemEncontrado;
  }

  public turno(atacanteId: number, defensorId: number): Acao[] {
    const atacante = this.consultarId(atacanteId);
    const defensor = this.consultarId(defensorId);

    if (atacanteId === defensorId) {
      throw new Error(
        `O personagem ${atacante.nome} não pode atacar a si mesmo.`
      );
    }

    if (!atacante.estaVivo()) {
      throw new Error(
        `O personagem ${atacante.nome} não pode atacar, pois está morto.`
      );
    }

    const ataqueBaseOriginalAtacante = atacante.ataqueBase;
    const ataqueBaseOriginalDefensor = defensor.ataqueBase;
    const defesaBaseOriginalDefensor = defensor.defesaBase;

    if (defensor instanceof Eterno && !(atacante instanceof Eterno)) {
      throw new AtaqueNaoPermitidoException(
        `🚫 O ataque de ${atacante.nome} não surtiu efeito em ${defensor.nome} (Eterno) e foi repelido!`
      );
    }

    console.log(
      `\n🥊 Vez de ${atacante.nome} (${atacante.constructor.name}) atacando ${defensor.nome} (${defensor.constructor.name})`
    );

    let ataqueDoTurno = atacante.ataqueBase;

    if (atacante instanceof Guerreiro && atacante.vida < 30) {
      ataqueDoTurno = Math.floor(ataqueDoTurno * 1.3);
      console.log(
        `\n🔥 ${atacante.nome} ativou o Modo Fúria! Ataque Bônus: ${ataqueDoTurno}`
      );
    }

    if (atacante instanceof Mago) {
      if (defensor instanceof Guerreiro) {
        defensor.defesaBase = 0;
        console.log(
          `\n🛡️ Defesa de ${defensor.nome} (Guerreiro) ignorada pela magia!`
        );
      }
      if (defensor instanceof Arqueiro) {
        ataqueDoTurno *= 2;
        console.log(
          `\n⚡ Bônus Mágico! Dano dobrado contra ${defensor.nome}! Ataque Bônus: ${ataqueDoTurno}`
        );
      }

      atacante.receberDano(10);
      atacante.registrarDanoCausado(10);
      console.log(`\n🩸 Mago sofre 10 de vida por custo de conjuração.`);
      const acaoCusto = new Acao(
        atacante,
        atacante,
        "autodano",
        10,
        new Date()
      );
      this._acoesTemporarias.push(acaoCusto);
      atacante.registrarAcao(acaoCusto);
    }

    if (atacante instanceof Arqueiro) {
      const arqueiro = atacante as Arqueiro;
      if (acertoEventoProbabilidade(50)) {
        ataqueDoTurno *= arqueiro.ataqueMultiplo;
        console.log(
          `\n🏹 ${arqueiro.nome} ativou o Ataque Múltiplo! (x${arqueiro.ataqueMultiplo}) Ataque Bônus: ${ataqueDoTurno}`
        );
      }
    }

    if (atacante instanceof Barbaro) {
      const danoExtra = Math.floor(atacante.danoRecebidoTotal * 0.1);
      if (danoExtra > 0) {
        ataqueDoTurno += danoExtra;
        console.log(
          `\n🩸 ${atacante.nome} ativou o Desespero! Dano Extra (10% do Dano Recebido Total). Ataque Bônus: ${ataqueDoTurno}`
        );
      }
    }

    if (atacante instanceof Exausto) {
      const novoAtaqueBase = Math.max(1, Math.floor(atacante.ataqueBase / 2));
      atacante.ataqueBase = novoAtaqueBase;

      console.log(
        `\n💤 ${atacante.nome} cansou! Seu ataque base caiu para ${novoAtaqueBase} para o próximo turno.`
      );
    }

    const acaoExecutada = new Acao(
      atacante,
      defensor,
      "ataque",
      ataqueDoTurno,
      new Date()
    );

    let danoAtaqueFinal = acaoExecutada.valorDano;
    let ataqueIgnorado = false;

    if (defensor instanceof Guerreiro) {
      if (danoAtaqueFinal < defensor.ataqueBase) {
        danoAtaqueFinal = 0;
        ataqueIgnorado = true;
        console.log(
          `🛡️ O ataque de ${atacante.nome} é muito fraco e não surtiu efeito em ${defensor.nome}.`
        );
      }
    }

    if (!ataqueIgnorado) {
      let danoEfetivo = Math.max(0, danoAtaqueFinal - defensor.defesaBase);
      atacante.registrarDanoCausado(danoEfetivo);

      if (defensor instanceof Reflexivo && danoEfetivo > 0) {
        if (atacante instanceof Eterno) {
          console.log(
            `🚫 ${defensor.nome} tentou refletir, mas o poder do Eterno ignora o reflexo.`
          );
        } else {
          console.log(
            `\n🪞 ${defensor.nome} reflete ${danoEfetivo} de dano de volta para ${atacante.nome}!`
          );
          atacante.receberDano(danoEfetivo);
          defensor.registrarDanoCausado(danoEfetivo);
          if (!atacante.estaVivo()) {
            defensor.registrarAbate();
          }
          danoEfetivo = 0;
        }
      }

      console.log(
        `\n💥 ATAQUE EXECUTADO: ${atacante.nome} causou ${danoAtaqueFinal} de dano em ${defensor.nome}.`
      );
      console.log(
        `📉 DEFESA REALIZADA: ${defensor.nome} recebeu um total de ${danoEfetivo} de dano!`
      );

      if (danoEfetivo > 0) {
        defensor.receberDano(danoEfetivo);
        if (!defensor.estaVivo()) {
          atacante.registrarAbate();
        }
      }
    }

    defensor.ataqueBase = ataqueBaseOriginalDefensor;
    defensor.defesaBase = defesaBaseOriginalDefensor;

    this.acoesTemporarias.push(acaoExecutada);
    return [acaoExecutada];
  }

  public sortearCombatentes(
    participantes: Personagem[] = this.personagens
  ): Personagem[] {
    const vivos = participantes.filter((p) => p.estaVivo());
    const atacante = sorteio(vivos);
    const defensores = vivos.filter((p) => p !== atacante);
    const defensor = sorteio(defensores);

    return [atacante, defensor];
  }

  public verificarVencedor(
    participantes: Personagem[]
  ): Personagem | undefined {
    const vencedor = participantes.find((p) => p.estaVivo());
    return vencedor;
  }

  private gerarResumoBatalha(
    participantes: Personagem[],
    detalhado: boolean
  ): void {
    if (detalhado) {
      console.log(`\n🏆 Resultado Final:`);
      const vencedor = this.verificarVencedor(participantes);

      if (vencedor) {
        console.log(
          `\n✔️ Vencedor: ${vencedor.nome} (${vencedor.constructor.name}), sobrevivendo com ${vencedor.vida} de vida.`
        );
      } else {
        console.log("\n💥 Empate! Ambos os jogadores foram derrotados!");
      }

      console.log("\n==============================================");
      console.log("📋 ESTATÍSTICAS DA BATALHA");

      participantes.sort((a, b) => b.danoCausadoTotal - a.danoCausadoTotal);
      participantes.forEach((p) => {
        const status = p.estaVivo() ? "💙 VIVO" : "❌ MORTO";
        console.log(`\n👤 ${p.nome} (${p.constructor.name}) ${status}`);
        console.log(`  • Dano Causado Total: ${p.danoCausadoTotal}`);
        console.log(`  • Abates: ${p.abates}`);
      });
      console.log("==============================================");
    }
  }

  private reviverTodosPersonagens(): void {
    const mortosAntes = this.personagens.filter((p) => !p.estaVivo());

    if (mortosAntes.length === 0) {
      console.log(
        "\n❌ Não há personagens mortos para reviver. Todos estão vivos!"
      );
      return;
    }

    let count = 0;
    for (const personagem of this.personagens) {
      if (!personagem.estaVivo()) {
        personagem.vida = 100;
        personagem.vivo = true;
        count++;
      }
    }

    console.log(
      `\n✨ ✅ ${count} personagem(ns) ressuscitado(s) com 100 de vida!`
    );
  }

  private reviverPersonagem(id: number): void {
    const personagem = this.personagens.find((p) => p.id === id);

    if (!personagem) {
      throw new Error(`\n❌ Personagem com ID ${id} não encontrado.`);
    }

    if (personagem.estaVivo()) {
      throw new Error(`\n❌ ${personagem.nome} já está vivo(a)!`);
    }

    personagem.vida = 100;
    personagem.vivo = true;
    console.log(`\n✨ ✅ ${personagem.nome} ressuscitado(a) com 100 de vida!`);
  }

  public salvarDados(): void {
    try {
      const dadosParaSalvar = this.personagens.map((p) => p.toJSON());
      const dadosJSON = JSON.stringify(dadosParaSalvar, null, 2);

      fs.writeFileSync(this.NOME_ARQUIVO, dadosJSON, "utf-8");
      console.log(`\n💾 Dados de personagens salvos!`);
    } catch (erro) {
      console.error(`\n❌ Erro ao salvar dados: ${erro}`);
    }
  }

  public salvarLogHistorico(): void {
    try {
      const dadosParaSalvar = this.logHistorico.map((b) => b.toJSON());
      const dadosJSON = JSON.stringify(dadosParaSalvar, null, 2);

      fs.writeFileSync(this.NOME_LOG, dadosJSON, "utf-8");
    } catch (erro: any) {
      console.error(`\n❌ Erro ao salvar log: ${erro.message}`);
    }
  }

  public carregarDados(): void {
    try {
      if (!fs.existsSync(this.NOME_ARQUIVO)) {
        return;
      }
      const dadosJSON = fs.readFileSync(this.NOME_ARQUIVO, "utf-8");
      const dados: any[] = JSON.parse(dadosJSON);

      this.personagens = [];
      let maxId = 0;

      for (const dado of dados) {
        let personagem: Personagem;
        switch (dado.classe) {
          case "Guerreiro":
            personagem = new Guerreiro(dado.id, dado.nome);
            break;
          case "Mago":
            personagem = new Mago(dado.id, dado.nome);
            break;
          case "Arqueiro":
            personagem = new Arqueiro(dado.id, dado.nome);
            (personagem as Arqueiro).ataqueMultiplo = dado.ataqueMultiplo;
            break;
          case "Barbaro":
            personagem = new Barbaro(dado.id, dado.nome);
            break;
          case "Reflexivo":
            personagem = new Reflexivo(dado.id, dado.nome);
            break;
          case "Exausto":
            personagem = new Exausto(dado.id, dado.nome);
            break;
          case "Eterno":
            personagem = new Eterno(dado.id, dado.nome);
            break;
          default:
            console.error(`Classe desconhecida: ${dado.classe}`);
            continue;
        }

        personagem.vida = dado.vida;
        personagem.ataqueBase = dado.ataqueBase;
        personagem.defesaBase = dado.defesaBase;
        personagem.vivo = dado.vivo;

        this.adicionarPersonagem(personagem);
        if (personagem.id > maxId) {
          maxId = personagem.id;
        }
      }
    } catch (erro) {
      console.log("");
    }
  }

  public carregarLogHistorico(): void {
    try {
      if (!fs.existsSync(this.NOME_LOG)) {
        return;
      }
      const dadosJSON = fs.readFileSync(this.NOME_LOG, "utf-8");
      const dados: any[] = JSON.parse(dadosJSON);

      this.logHistorico = [];

      for (const dado of dados) {
        const acoesReconstruidas = dado.acoes.map((a: any) => {
          const origemSimulada = { nome: a.origemNome } as Personagem;
          const alvoSimulado = { nome: a.alvoNome } as Personagem;
          return new Acao(
            origemSimulada,
            alvoSimulado,
            a.tipo,
            a.valorDano,
            new Date(a.dataHora)
          );
        });

        const participantesReconstruidos = dado.participantes.map(
          (p: any) =>
            ({
              nome: p.nome,
              danoCausadoTotal: p.danoCausadoTotal,
              abates: p.abates,
            } as Personagem)
        );
        const vencedorReconstruido = dado.vencedor
          ? ({ nome: dado.vencedor.nome } as Personagem)
          : null;

        this.logHistorico.push(
          new BatalhaCompleta(
            dado.id,
            participantesReconstruidos,
            acoesReconstruidas,
            vencedorReconstruido
          )
        );
      }
    } catch (erro: any) {
      console.log(`\n❌ Erro ao carregar log de batalhas: ${erro.message}`);
    }
  }

  get personagens() {
    return this._personagens;
  }

  get logHistorico() {
    return this._logHistorico;
  }

  get acoesTemporarias() {
    return this._acoesTemporarias;
  }

  set personagens(personagens: Personagem[]) {
    this._personagens = personagens;
  }

  set logHistorico(logHistorico: BatalhaCompleta[]) {
    this._logHistorico = logHistorico;
  }

  set acoesTemporarias(acoes: Acao[]) {
    this._acoesTemporarias = acoes;
  }
}

let batalha: Batalha = new Batalha();
batalha.menu();
