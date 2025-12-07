import { Personagem } from "./personagem";
import { Acao } from "./acao";
import { Guerreiro } from "./guerreiro";
import { Mago } from "./mago";
import { Arqueiro } from "./arqueiro";
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
              const guerreiro: Guerreiro = new Guerreiro(id, nome, 5, 1);
              this.adicionarPersonagem(guerreiro);
              break;
            case "2":
              nome = this.input("Nome: ");
              const mago: Mago = new Mago(id, nome, 3, 3);
              this.adicionarPersonagem(mago);
              break;
            case "3":
              nome = this.input("Nome: ");
              const arqueiro: Arqueiro = new Arqueiro(id, nome, 4, 2);
              this.adicionarPersonagem(arqueiro);
              break;
          }
          id++;
          break;

        case "2":
          const atacanteId: number = parseInt(this.input("ID do Jogador 1: "));
          const defensorId: number = parseInt(this.input("ID do Jogador 2: "));

          const existeAtacante: boolean =
            this.existePersonagemComId(atacanteId);
          const existeDefensor: boolean =
            this.existePersonagemComId(defensorId);

          if (existeAtacante && existeDefensor) {
            console.log("\n[TURNO]: Iniciando rodada.");
            let atacante = this.encontrarPersonagem(atacanteId)!;
            let defensor = this.encontrarPersonagem(defensorId)!;

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
              console.log("\nFim do turno.\n");
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

  public adicionarPersonagem(p: Personagem): void {
    this.personagens.push(p);
  }

  public adicionarAcao(acao: Acao): void {
    this.acoes.push(acao);
  }
  private encontrarPersonagem(id: number): Personagem {
    return this.personagens.find((p) => p.id === id)!;
  }

  private existePersonagemComId(id: number): boolean {
    return this.encontrarPersonagem(id) ? true : false;
  }

  public turno(atacanteId: number, defensorId: number): Acao[] {
    const atacante = this.encontrarPersonagem(atacanteId);
    const defensor = this.encontrarPersonagem(defensorId);

    if (!atacante || !defensor) {
      console.error("\nAtacante ou defensor não encontrado.");
      return [];
    }

    if (atacanteId === defensorId) {
      console.error("\nUm personagem não pode atacar a si mesmo.");
      return [];
    }

    if (atacante.nome === defensor.nome) {
      console.log("\nOs nomes dos oponentes não podem ser iguais.");
      return [];
    }

    console.log(`\n========== Vez de ${atacante.nome} ==========`);
    console.log("\nEscolha seu ataque: \n");

    atacante.ataques.forEach((ataque, index) => {
      if (ataque === "Ataque Duplo" && atacante instanceof Arqueiro) {
        console.log(
          `${index + 1} - ${ataque} (${
            (atacante as Arqueiro).usosRestantesAtaqueDuplo
          }x)`
        );
      } else {
        console.log(`${index + 1} - ${ataque}`);
      }
    });

    const opcaoAtaque = parseInt(this.input("Opção: "));
    const ataqueEscolhido = atacante.ataques[opcaoAtaque - 1];

    let acao: Acao;

    if (ataqueEscolhido) {
      switch (ataqueEscolhido) {
        case "Ataque":
          acao = atacante.atacar(defensor);
          break;
        case "Magia":
          acao = (atacante as Mago).atacar(defensor);
          break;
        case "Magia Especial":
          acao = (atacante as Mago).magiaEspecial(defensor);
          break;
        case "Ataque Duplo":
          acao = (atacante as Arqueiro).ataqueDuplo(defensor);
          break;
      }
    }
    if (acao!) {
      defensor.receberDano(acao.valorDano);
      this.adicionarAcao(acao);
      console.log(
        `\n${atacante.nome} usou ${acao.tipo} em ${defensor.nome}!\n`
      );
      console.log(`Vida de ${atacante.nome}: ${atacante.vida}`);
      console.log(`Vida de ${defensor.nome}: ${defensor.vida}`);
      return [acao];
    }

    console.error("Ataque inválido!");
    return [];
  }

  public listarPersonagens(): Personagem[] {
    return this.personagens;
  }

  public listarAcoes(): Acao[] {
    return this.acoes;
  }

  public verificarVencedor(p1: Personagem, p2: Personagem): Personagem {
    const personagensBatalhando = [p1, p2];
    const quemEstaVivo = personagensBatalhando.filter((p) => p.estaVivo())[0];
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
const p1: Guerreiro = new Guerreiro(1, "Sparta", 5, 1);
const p2: Mago = new Mago(2, "Patolino", 3, 3);
const p3: Arqueiro = new Arqueiro(3, "Jonh", 4, 2);
batalha.adicionarPersonagem(p1);
batalha.adicionarPersonagem(p2);
batalha.adicionarPersonagem(p3);
batalha.menu();
