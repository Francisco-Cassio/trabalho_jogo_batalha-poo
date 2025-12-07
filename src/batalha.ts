import { Personagem } from "./personagem";
import { Acao } from "./acao";
import { Guerreiro } from "./guerreiro";
import { Mago } from "./mago";
import { Arqueiro } from "./arqueiro";
import { acertoEventoProbabilidade } from "./utils/utils";
import prompt from "prompt-sync";

class Batalha {
  private _personagens: Personagem[];
  private _acoes: Acao[];
  private input = prompt();

  constructor() {
    this._personagens = [];
    this._acoes = [];
  }

  public menu(): void {
    let opcao: string = "";
    let opcaoPersonagem: string = "";
    let id: number = 1;
    let nome: string = "";

    do {
      console.log("\n⚔️ ======== ARENA DE BATALHA ======== 🛡️\n");
      console.log(" 1 - Adicionar Personagem");
      console.log(" 2 - Iniciar Turno de Combate");
      console.log(" 3 - Verificar Status dos Personagens");
      console.log(" 4 - Logs de Ações");
      console.log("\n 0 - Sair da Aplicação");
      console.log("\n======================================\n");
      opcao = this.input("Opção: ");
      switch (opcao) {
        case "1":
          console.log(
            "\nSeu personagem será:\n1 - Guerreiro 🛡️\n2 - Mago 🔮\n3 - Arqueiro 🏹"
          );
          opcaoPersonagem = this.input("Opção: ");
          switch (opcaoPersonagem) {
            case "1":
              nome = this.input("Nome: ");
              const guerreiro: Guerreiro = new Guerreiro(id, nome);
              this.adicionarPersonagem(guerreiro);
              console.log(`✅ Guerreiro ${nome} adicionado!`);
              break;
            case "2":
              nome = this.input("Nome: ");
              const mago: Mago = new Mago(id, nome);
              this.adicionarPersonagem(mago);
              console.log(`✅ Mago ${nome} adicionado!`);
              break;
            case "3":
              nome = this.input("Nome: ");
              const arqueiro: Arqueiro = new Arqueiro(id, nome);
              this.adicionarPersonagem(arqueiro);
              console.log(`✅ Arqueiro ${nome} adicionado!`);
              break;
            default:
              console.log("❌ Opção de classe inválida.");
              break;
          }
          id++;
          break;

        case "2":
          const atacanteNome: string = this.input("🗡️ Nome do Jogador 1: ");
          const defensorNome: string = this.input("🗡️ Nome do Jogador 2: ");

          let atacante = this.consultarPersonagem(atacanteNome)!;
          let defensor = this.consultarPersonagem(defensorNome)!;

          if (!atacante || !defensor) {
            console.error(
              "\n❌ Atacante ou defensor não encontrado. Verifique os nomes."
            );
            break;
          }

          if (!atacante.estaVivo() || !defensor.estaVivo()) {
            console.log(`\n❌ Um dos personagens já está fora de combate!`);
            break;
          }

          console.log(
            `\n🔥 INICIANDO COMBATE: ${atacante.nome} vs ${defensor.nome} 🔥`
          );

          do {
            console.log(
              `\n============== ⚔️ RODADA DE COMBATE ⚔️ ==============`
            );
            this.turno(atacante.id, defensor.id);
            const auxTrocaPersonagens = atacante;
            atacante = defensor;
            defensor = auxTrocaPersonagens;

            console.log(
              `\n👤 Situação Atual:\n\n  • ${atacante.nome}: ${atacante.vida} vida\n  • ${defensor.nome}: ${defensor.vida} vida`
            );
          } while (atacante.estaVivo() && defensor.estaVivo());

          console.log("\n=========== ❌ FIM DA BATALHA ❌ ===========");
          const vencedor = this.verificarVencedor(atacante, defensor);
          if (vencedor) {
            console.log(
              `\n🏆 Vencedor: ${vencedor.nome} (${vencedor.constructor.name})`
            );
            console.log(`🏷️ ID: ${vencedor.id}`);
            console.log(`🫀 Vida Restante: ${vencedor.vida}`);
            console.log(`🗡️ Ataque: ${vencedor.ataqueBase}`);
            console.log(`🛡️ Defesa: ${vencedor.defesaBase}`);
          } else {
            console.log("\n💥 Empate! Ambos os jogadores foram derrotados!\n");
          }
          break;

        case "3":
          console.log("\n📋 STATUS DOS PERSONAGENS:");
          console.log(this.listarPersonagens());
          break;
        case "4":
          console.log("\n📜 LOG DE AÇÕES:");
          console.log(this.listarAcoes());
          break;
        case "0":
          break;
        default:
          console.log("❌ Opção inválida!");
      }
      this.input("\n☑️ Operação finalizada. Pressione <Enter> para continuar.");
    } while (opcao != "0");

    console.log("\n👋 Aplicação encerrada. Volte sempre!");
  }

  public consultarId(id: number): Personagem {
    return this.personagens.find((p) => p.id === id)!;
  }

  public adicionarPersonagem(p: Personagem): void {
    this.personagens.push(p);
  }

  public turno(atacanteNome: number, defensorNome: number): Acao[] {
    const atacante = this.consultarId(atacanteNome);
    const defensor = this.consultarId(defensorNome);
    const ataqueAtacante: number = atacante.ataqueBase;
    const ataqueDefensor: number = defensor.ataqueBase;

    if (!atacante || !defensor) {
      console.error("\nAtacante ou defensor não encontrado.");
      return [];
    }

    if (atacanteNome === defensorNome) {
      console.error("\nUm personagem não pode atacar a si mesmo.");
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
        `💥 ${atacante.nome} causou ${acaoExecutada.valorDano} de dano.`
      );
    }

    atacante.ataqueBase = ataqueAtacante;
    defensor.ataqueBase = ataqueDefensor;
    this.acoes.push(acaoExecutada);
    return [acaoExecutada];
  }

  private consultarPersonagem(nome: string): Personagem {
    return this.personagens.find((p) => p.nome === nome)!;
  }

  public listarPersonagens(): Personagem[] {
    return this.personagens;
  }

  public listarAcoes(): Acao[] {
    return this.acoes;
  }

  public verificarVencedor(p1: Personagem, p2: Personagem): Personagem {
    const personagensVivos = [p1, p2];
    const quemEstaVivo = personagensVivos.filter((p) => p.estaVivo())[0];
    return quemEstaVivo;
  }

  get personagens() {
    return this._personagens;
  }

  get acoes() {
    return this._acoes;
  }
}

let batalha: Batalha = new Batalha();
const p1: Guerreiro = new Guerreiro(1, "Thorgal");
const p2: Mago = new Mago(2, "Lyra");
const p3: Arqueiro = new Arqueiro(3, "Elandor");
batalha.adicionarPersonagem(p1);
batalha.adicionarPersonagem(p2);
batalha.adicionarPersonagem(p3);
batalha.menu();
