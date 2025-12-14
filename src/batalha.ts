import { Personagem } from "./personagem";
import { Acao } from "./acao";
import { Guerreiro } from "./guerreiro";
import { Mago } from "./mago";
import { Arqueiro } from "./arqueiro";
import { Barbaro } from "./barbaro";
import { acertoEventoProbabilidade, sorteio } from "./utils/utils";
import prompt from "prompt-sync";
import * as fs from "fs";

class Batalha {
  private _personagens: Personagem[];
  private _acoes: Acao[];
  private input = prompt();
  private NOME_ARQUIVO = "dados_batalha.json";

  constructor() {
    this._personagens = [];
    this._acoes = [];
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
    if (this.personagens.length > 0) {
      id = Math.max(...this.personagens.map((p) => p.id)) + 1;
    }

    do {
      console.log("\n⚔️ ======== ARENA DE BATALHA ======== 🛡️\n");
      console.log(" 1 - Adicionar Personagem");
      console.log(" 2 - Iniciar Turno de Combate");
      console.log(" 3 - Verificar Personagens");
      console.log(" 4 - Logs de Ações");
      console.log(" 5 - Resumo da Batalha (Estatísticas) 📈");
      console.log("\n 0 - Sair da Aplicação");
      console.log("\n======================================\n");
      opcao = this.input("➡️ Opção: ");
      try {
        switch (opcao) {
          case "1":
            console.log("\n⚔️ ======== ADICIONAR PERSONAGEM ======== 🛡️");
            console.log(
              "\nSeu personagem será:\n\n 1 - Guerreiro 🛡️\n 2 - Mago 🔮\n 3 - Arqueiro 🏹\n 4 - Bárbaro 🪓\n"
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
              default:
                console.log("\n❌ Opção de classe inválida.");
                break;
            }
            id++;
            break;

          case "2":
            if (this.personagens.length === 0) {
              console.log(
                "\n❌ Não há personagens criados. Adicione personagens antes de iniciar o combate."
              );
              break;
            }

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

            console.log("📋 STATUS ATUAL DE TODOS OS PERSONAGENS:\n");
            this.personagens.forEach((p) => {
              const status = p.estaVivo() ? "💙 VIVO" : "❌ MORTO";
              console.log(
                `  • ${p.id} - ${p.nome} (${p.constructor.name}): ${p.vida} vida ${status}`
              );
            });
            console.log("\n=============================================");

            if (participantesGeraisVivos.length < 2) {
              throw new Error(
                `❌ Combate não pode iniciar: Apenas ${participantesGeraisVivos.length} personagem(ns) está(ão) vivo(s). Mínimo de 2 é necessário.`
              );
            }

            const participantes = this.selecionarParticipantes();
            if (participantes.length < 2) break;

            console.log(
              "\n==============🔥 INICIANDO COMBATE 🔥=============="
            );

            console.log(`\n🤺 Jogadores:\n`);
            participantes.forEach((p) => {
              console.log(`  • ${p.nome} (${p.constructor.name})`);
            });
            this.input("\n➡️ <Enter> para iniciar o turno.");

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

              this.turno(atacante.id, defensor.id);

              console.log(`\n👤 Situação Atual:\n`);
              participantes.forEach((p) => {
                if (!p.estaVivo()) {
                  console.log(`  • ${p.nome}: ${p.vida} vida ❌ morto(a)`);
                } else {
                  console.log(`  • ${p.nome}: ${p.vida} vida 💙`);
                }
              });
            }

            console.log("\n=========== ❌ FIM DA BATALHA ❌ ===========");
            const vencedor = this.verificarVencedor(participantes);

            if (vencedor) {
              console.log(`\n🏆 Resultado Final:`);
              console.log(
                `\n✔️ Vencedor: ${vencedor.nome} (${vencedor.constructor.name})`
              );
              console.log(`🧡️ Vida Restante: ${vencedor.vida}`);
            } else {
              console.log(
                "\n💥 Empate! Ambos os jogadores foram derrotados!\n"
              );
            }
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
              "\n📜 ========= LINHA DO TEMPO DA BATALHA (LOG DE AÇÕES) ========= 📜"
            );

            if (this._acoes.length === 0) {
              console.log(
                "\n❌ Nenhuma ação registrada ainda. Inicie uma batalha!"
              );
              break;
            }

            this._acoes.forEach((acao, index) => {
              const acaoIndex = index + 1;

              console.log(`\n➡️ AÇÃO ${acaoIndex}:`);
              console.log(acao.toString());
            });

            console.log(
              "\n================================================================="
            );
            break;

          case "5":
            if (this.personagens.length === 0) {
              console.log("\n❌ Não há personagens criados.");
              break;
            }
            this.gerarResumoBatalha(this.personagens);
            break;

          case "0":
            this.salvarDados();
            break;

          default:
            console.log("\n❌ Opção inválida!");
        }
      } catch (error: any) {
        console.log(`\n${error.message}`);
      }
      this.input("\n☑️ Pressione <Enter> para continuar.");
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

  public turno(atacanteId: number, defensorId: number): Acao[] {
    const atacante = this.consultarId(atacanteId);
    const defensor = this.consultarId(defensorId);
    const ataqueAtacante: number = atacante.ataqueBase;
    const ataqueDefensor: number = defensor.ataqueBase;
    const defesaDefensor: number = defensor.defesaBase;

    if (atacanteId === defensorId) {
      throw new Error(
        `O personagem ${atacante.nome} não pode atacar a si mesmo.`
      );
    }

    console.log(
      `\n🥊 Vez de ${atacante.nome} (${atacante.constructor.name}) atacando ${defensor.nome} (${defensor.constructor.name})`
    );

    if (atacante instanceof Guerreiro) {
      if (atacante.vida < 30) {
        atacante.ataqueBase = Math.floor(atacante.ataqueBase * 1.3);
        console.log(
          `\n🔥 ${atacante.nome} ativou o Modo Fúria! Ataque Bônus: ${atacante.ataqueBase}`
        );
      }
    } else if (atacante instanceof Mago) {
      if (defensor instanceof Guerreiro) {
        defensor.defesaBase = 0;
        console.log(
          `\n🛡️ Defesa de ${defensor.nome} (Guerreiro) ignorada pela magia!`
        );
      }

      if (defensor instanceof Arqueiro) {
        atacante.ataqueBase *= 2;
        console.log(
          `\n⚡ Bônus Mágico! Dano dobrado contra ${defensor.nome}! Ataque Bônus: ${atacante.ataqueBase}`
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
      this.acoes.push(acaoCusto);
      atacante.registrarAcao(acaoCusto);
    } else if (atacante instanceof Arqueiro) {
      const arqueiro = atacante as Arqueiro;
      if (acertoEventoProbabilidade(50)) {
        arqueiro.ataqueBase *= arqueiro.ataqueMultiplo;
        console.log(
          `\n🏹 ${arqueiro.nome} ativou o Ataque Múltiplo! (x${arqueiro.ataqueMultiplo}) Ataque Bônus: ${arqueiro.ataqueBase}`
        );
      }
    } else if (atacante instanceof Barbaro) {
      const danoExtra = Math.floor(atacante.danoRecebidoTotal * 0.1);
      if (danoExtra > 0) {
        atacante.ataqueBase += danoExtra;
        console.log(
          `\n🩸 ${atacante.nome} ativou o Desespero! Dano Extra (10% do Dano Recebido Total). Ataque Bônus: ${atacante.ataqueBase}`
        );
      }
    }

    const acaoExecutada: Acao = atacante.atacar(defensor);
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
      console.log(
        `\n💥 ATAQUE EXECUTADO: ${atacante.nome} causou ${danoAtaqueFinal} de dano em ${defensor.nome}.`
      );
      const danoEfetivo = Math.max(0, danoAtaqueFinal - defensor.defesaBase);
      console.log(`📉 Dano Recebido por ${defensor.nome}: ${danoEfetivo}`);
      atacante.registrarDanoCausado(danoEfetivo);

      if (!defensor.estaVivo()) {
        atacante.registrarAbate();
      }
    }

    atacante.ataqueBase = ataqueAtacante;
    defensor.ataqueBase = ataqueDefensor;
    defensor.defesaBase = defesaDefensor;

    this.acoes.push(acaoExecutada);
    return [acaoExecutada];
  }

  private gerarResumoBatalha(participantes: Personagem[]): void {
    console.log("\n==============================================");
    console.log("🏆 RESUMO E ESTATÍSTICAS DA BATALHA 📋");
    console.log("==============================================");

    participantes.sort((a, b) => b.danoCausadoTotal - a.danoCausadoTotal);

    participantes.forEach((p) => {
      const status = p.estaVivo() ? "💙 VIVO" : "❌ MORTO";
      console.log(`\n👤 ${p.nome} (${p.constructor.name}) ${status}`);
      console.log(`  • Vida Final: ${p.vida}`);
      console.log(`  • Dano Total Causado: ${p.danoCausadoTotal}`);
      console.log(`  • Dano Total Recebido: ${p.danoRecebidoTotal}`);
      console.log(`  • Abates: ${p.abates}`);
    });

    const vencedor = this.verificarVencedor(participantes);
    if (vencedor) {
      console.log(
        `\n🏅 VENCEDOR: ${vencedor.nome} (${vencedor.constructor.name})`
      );
    } else {
      console.log("\n💥 Resultado: Empate. Nenhum vencedor.");
    }
    console.log(`\n📜 Ações Registradas: ${this.acoes.length}`);
    console.log("==============================================");
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

  public listarPersonagens(): Personagem[] {
    return this.personagens;
  }

  public listarAcoes(): Acao[] {
    return this.acoes;
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

  public salvarDados(): void {
    try {
      const dadosParaSalvar = this.personagens.map((p) => p.toJSON());
      const dadosJSON = JSON.stringify(dadosParaSalvar, null, 2);

      fs.writeFileSync(this.NOME_ARQUIVO, dadosJSON, "utf-8");
      console.log(`\n💾 Dados salvos!`);
    } catch (erro) {
      console.error(`\n❌ Erro ao salvar dados: ${erro}`);
    }
  }

  public carregarDados(): void {
    try {
      if (!fs.existsSync(this.NOME_ARQUIVO)) {
        return;
      }
      const dadosJSON = fs.readFileSync(this.NOME_ARQUIVO, "utf-8");
      const dados: any[] = JSON.parse(dadosJSON);

      this._personagens = [];
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

  get personagens() {
    return this._personagens;
  }

  get acoes() {
    return this._acoes;
  }
}

let batalha: Batalha = new Batalha();
batalha.menu();
