import { Personagem } from "./personagem";
import { Acao } from "./acao";
import { Guerreiro } from "./guerreiro";
import { Mago } from "./mago";
import { Arqueiro } from "./arqueiro";
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
      console.log("\n 0 - Sair da Aplicação");
      console.log("\n======================================\n");
      opcao = this.input("➡️ Opção: ");
      switch (opcao) {
        case "1":
          console.log("\n⚔️ ======== ADICIONAR PERSONAGEM ======== 🛡️");
          console.log(
            "\nSeu personagem será:\n\n 1 - Guerreiro 🛡️\n 2 - Mago 🔮\n 3 - Arqueiro 🏹\n"
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
            default:
              console.log("\n❌ Opção de classe inválida.");
              break;
          }
          id++;
          break;

        case "2":
          if (this.personagens.length < 2) {
            console.log("\n❌ Mínimo de 2 personagens para iniciar combate.");
            break;
          }

          console.log("\n=============================================\n");

          const participantes = this.selecionarParticipantes();
          if (participantes.length < 2) break;

          console.log("\n==============🔥 INICIANDO COMBATE 🔥==============");
          console.log(`\n🤺 Jogadores:\n`);
          participantes.forEach((p) => {
            console.log(`  • ${p.nome} (${p.constructor.name})`);
          });
          this.input("\n➡️ <Enter> para iniciar o turno.");

          while (participantes.filter((p) => p.estaVivo()).length > 1) {
            console.log(
              `\n============== ⚔️ RODADA DE COMBATE ⚔️ ==============`
            );
            const combatentes = this.sortearCombatentes(participantes);
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
            console.log("\n💥 Empate! Ambos os jogadores foram derrotados!\n");
          }
          break;

        case "3":
          console.log("==============================================");
          console.log("\n📋 LISTA DE PERSONAGENS:\n");
          this.personagens.forEach((p) => {
            console.log(`👤 ${p.nome} (${p.constructor.name})`);
          });

          console.log("\n🔎 Digite o nome para ver atributos: ");
          const nomeBusca = this.input("➡️ ").toLocaleLowerCase();
          console.log("\n==============================================");
          const personagemEncontrado = this.consultarPersonagem(nomeBusca);
          if (!personagemEncontrado) {
            console.log("\n❌ Personagem não encontrado!");
            break;
          }
          console.log("\n📋 STATUS DO PERSONAGEM:\n");
          console.log(personagemEncontrado.toString());
          break;

        case "4":
          console.log("\n==============================================");
          console.log("\n📜 LOG DE AÇÕES:");
          if (this.acoes.length === 0) {
            console.log("\n❌ Nenhuma ação registrada!");
            break;
          }
          this.acoes.forEach((acao) => {
            console.log(
              `\nAção ${this.acoes.indexOf(acao) + 1}:\n${acao.toString()}`
            );
          });
          break;

        case "0":
          this.salvarDados();
          break;

        default:
          console.log("\n❌ Opção inválida!");
      }
      this.input("\n☑️ Pressione <Enter> para continuar.");
    } while (opcao != "0");

    console.log("\n👋 Aplicação encerrada. Volte sempre!");
  }

  private selecionarParticipantes(): Personagem[] {
    console.log("\n👥 Escolha os personagens para a batalha:\n");
    this.personagens.forEach((p) =>
      console.log(`${p.id} - ${p.nome} (${p.constructor.name})`)
    );
    console.log(
      "\n🏷️ Digite:\n- IDs separados por vírgula (ex: 1,2).\n- <Enter> para selecionar todos.\n- '0' para cancelar.\n"
    );

    const idsEscolhidos = this.input("➡️ Opção: ");

    if (idsEscolhidos.trim() === "0") return [];

    if (!idsEscolhidos.trim()) {
      return this.personagens;
    }

    const participantes: Personagem[] = [];
    const ids = idsEscolhidos.split(",");

    for (const item of ids) {
      const id = parseInt(item.trim());
      if (isNaN(id)) {
        console.log("\n❌ Digite valores válidos.");
        return this.selecionarParticipantes();
      }
      const p = this.personagens.find((personagem) => personagem.id === id);
      if (!p) {
        console.log(`\n❌ Personagem com ID ${id} não encontrado.`);
        return this.selecionarParticipantes();
      }
      if (!participantes.includes(p)) participantes.push(p);
    }

    if (participantes.length < 2) {
      console.log("\n❌ Seleção inválida. Mínimo de 2 personagens.");
      return this.selecionarParticipantes();
    }

    return participantes;
  }

  public consultarId(id: number): Personagem {
    return this.personagens.find((p) => p.id === id)!;
  }

  public adicionarPersonagem(p: Personagem): void {
    this.personagens.push(p);
  }

  public turno(atacanteId: number, defensorId: number): Acao[] {
    const atacante = this.consultarId(atacanteId);
    const defensor = this.consultarId(defensorId);
    const ataqueAtacante: number = atacante.ataqueBase;
    const ataqueDefensor: number = defensor.ataqueBase;
    const defesaDefensor: number = defensor.defesaBase;

    if (!atacante || !defensor) {
      console.error("\nAtacante ou defensor não encontrado.");
      return [];
    }

    if (atacanteId === defensorId) {
      console.log("\nUm personagem não pode atacar a si mesmo.");
      return [];
    }

    if (atacante.nome === defensor.nome) {
      console.log("\nOs nomes dos oponentes não podem ser iguais.");
      return [];
    }

    console.log(
      `\n🥊 Vez de ${atacante.nome} (${atacante.constructor.name})\n`
    );

    if (atacante instanceof Guerreiro) {
      if (atacante.vida < atacante.vida * 0.3) {
        atacante.ataqueBase = atacante.ataqueBase * 1.3;
        console.log(`🔥 ${atacante.nome} ativou o Modo Fúria! +30% de Ataque!`);
      }
    } else if (atacante instanceof Mago) {
      defensor.defesaBase = 0;

      if (defensor instanceof Arqueiro) {
        atacante.ataqueBase *= 2;
        console.log(`⚡ Bônus Mágico! Dano dobrado contra ${defensor.nome}!`);
      }
      atacante.receberDano(10);
      console.log(`🩸 Mago perde 10 de vida por conjuração.`);
    } else if (atacante instanceof Arqueiro) {
      if (acertoEventoProbabilidade(50)) {
        atacante.ataqueBase *= (atacante as Arqueiro).ataqueMultiplo;
        console.log(
          `🏹 ${atacante.nome} ativou o Ataque Múltiplo! (x${atacante.ataqueMultiplo})`
        );
      }
    }
    const acaoExecutada: Acao = atacante.atacar(defensor);
    let danoAtaqueFinal = acaoExecutada.valorDano;
    let ataqueIgnorado = false;

    if (defensor instanceof Guerreiro) {
      if (atacante.ataqueBase < defensor.ataqueBase) {
        danoAtaqueFinal = 0;
        ataqueIgnorado = true;
        console.log(
          `🛡️ O ataque de ${atacante.nome} é muito fraco e não surtiu efeito em ${defensor.nome}.`
        );
      }
    }
    if (!ataqueIgnorado) {
      console.log(
        `💥 ${atacante.nome} causou ${acaoExecutada.valorDano} de dano em ${defensor.nome}.`
      );
    }

    atacante.ataqueBase = ataqueAtacante;
    defensor.ataqueBase = ataqueDefensor;
    defensor.defesaBase = defesaDefensor;
    this.acoes.push(acaoExecutada);
    return [acaoExecutada];
  }

  private consultarPersonagem(nome: string): Personagem {
    return this.personagens.find((p) => p.nome.toLocaleLowerCase() === nome)!;
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

  public verificarVencedor(participantes: Personagem[]): Personagem {
    const vencedor = participantes.find((p) => p.estaVivo())!;
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
      console.error(`\n❌ Erro ao carregar dados: ${erro}`);
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
