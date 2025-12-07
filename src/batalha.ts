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
    let opcao_personagem: string = "";
    let id = 1;
    let nome: string = "";

    do {
      console.log("\n========== BATALHA ==========\n");
      console.log("1 - Adicionar Jogador");
      console.log("2 - Iniciar Turno");
      console.log("3 - Verificar Personagens");
      console.log("4 - Verificar Ações\n");
      console.log("0 - Sair");
      console.log("\n=============================\n");
      opcao = this.input("Opção: ");
      switch (opcao) {
        case "1":
          console.log(
            "Seu personagem será:\n1 - Guerreiro\n2 - Mago\n3 - Arqueiro"
          );
          opcao_personagem = this.input("Opção: ");
          switch (opcao_personagem) {
            case "1":
              nome = this.input("Nome: ");
              const guerreiro: Guerreiro = new Guerreiro(id, nome);
              this.adicionarPersonagem(guerreiro);
              break;
            case "2":
              nome = this.input("Nome: ");
              const mago: Mago = new Mago(id, nome);
              this.adicionarPersonagem(mago);
              break;
            case "3":
              nome = this.input("Nome: ");
              const arqueiro: Arqueiro = new Arqueiro(id, nome);
              this.adicionarPersonagem(arqueiro);
              break;
          }
          id++;
          break;

        case "2":
          const atacanteNome: string = this.input("Nome do Jogador 1: ");
          const defensorNome: string = this.input("Nome do Jogador 2: ");

          if (atacanteNome && defensorNome) {
            console.log("\n[TURNO]: Iniciando rodada.");
            let atacante = this.consultarPersonagem(atacanteNome)!;
            let defensor = this.consultarPersonagem(defensorNome)!;

            do {
              this.turno(atacante.id, defensor.id);
              const auxTrocaPersonagens = atacante;
              atacante = defensor;
              defensor = auxTrocaPersonagens;
            } while (atacante.estaVivo() && defensor.estaVivo());

            console.log("\n=========== FIM DO TURNO ==========");
            const vencedor = this.verificarVencedor(atacante, defensor);
            if (vencedor) {
              console.log(`\nVencedor: ${vencedor.nome}\n`);
              console.log(`ID: ${vencedor.id}`);
              console.log(`Vida Restante: ${vencedor.vida}`);
              console.log(`Ataque: ${vencedor.ataqueBase}`);
              console.log(`Defesa: ${vencedor.defesaBase}`);
            } else {
              console.log("\nEmpate!\nAmbos os jogadores foram derrotados!\n");
            }
          }
          break;
        case "3":
          console.log(this.listarPersonagens());
          break;
        case "4":
          console.log(this.listarAcoes());
          break;
        case "0":
          console.log("Saindo...");
          break;
        default:
          console.log("Opção inválida!");
      }
      this.input("Operação finalizada. Pressione <Enter> para continuar.");
    } while (opcao != "0");

    console.log("Aplicação encerrada.");
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
    const defesaDefensor: number = defensor.defesaBase;
    let acao: Acao;

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

    if (atacante instanceof Guerreiro) {
      if (atacante.vida < atacante.vida * 0.3) {
        atacante.ataqueBase = atacante.ataqueBase * 1.3;
      }

      if (defensor.ataqueBase < atacante.ataqueBase) {
        defensor.ataqueBase = 0;
        console.log(`\nO ataque de ${defensor.nome} não surtiu efeito.`);
      }
    } else if (atacante instanceof Mago) {
      defensor.defesaBase = 0;

      if (defensor instanceof Arqueiro) {
        atacante.ataqueBase *= 2;
      }
      atacante.receberDano(10);
    } else if (atacante instanceof Arqueiro) {
      if (acertoEventoProbabilidade(50)) {
        atacante.ataqueBase *= atacante.ataqueMultiplo;
      }
    }
    console.log(`\n========== Vez de ${atacante.nome} ==========`);

    acao = atacante.atacar(defensor);
    console.log(`\n${atacante.nome} usou ${acao.tipo} em ${defensor.nome}!\n`);
    console.log(`Vida de ${atacante.nome}: ${atacante.vida}`);
    console.log(`Vida de ${defensor.nome}: ${defensor.vida}`);
    atacante.ataqueBase = ataqueAtacante;
    defensor.ataqueBase = ataqueDefensor;
    defensor.defesaBase = defesaDefensor;
    this.acoes.push(acao);
    return [acao];
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
const p1: Guerreiro = new Guerreiro(1, "Sparta");
const p2: Mago = new Mago(2, "Patolino");
const p3: Arqueiro = new Arqueiro(3, "Jonh");
batalha.adicionarPersonagem(p1);
batalha.adicionarPersonagem(p2);
batalha.adicionarPersonagem(p3);
batalha.menu();
