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
      console.log("=============================\n");
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
              const guerreio: Guerreiro = new Guerreiro(id, nome, 5, 2);
              this.adicionarPersonagem(guerreio);
              break;
            case "2":
              nome = this.input("Nome: ");
              const mago: Mago = new Mago(id, nome, 3, 4);
              this.adicionarPersonagem(mago);
              break;
            case "3":
              nome = this.input("Nome: ");
              const arqueiro: Arqueiro = new Arqueiro(id, nome, 4, 3);
              this.adicionarPersonagem(arqueiro);
              break;
          }
          id++;
          break;

        case "2":
          const atacanteId: number = parseInt(this.input("ID do jogador 1: "));
          const defensorId: number = parseInt(this.input("ID do jogador 2: "));

          const existeAtacante: boolean =
            this.existePersonagemComId(atacanteId);
          const existeDefensor: boolean =
            this.existePersonagemComId(defensorId);

          if (existeAtacante && existeDefensor) {
            console.log("[TURNO]: Personagens existem, iniciando rolada.");
            let atacante = this.encontrarPersonagem(atacanteId)!;
            let defensor = this.encontrarPersonagem(defensorId)!;

            do {
              console.log(this.turno(atacante.id, defensor.id));
              const auxTrocaPersonagens = atacante;
              atacante = defensor;
              defensor = auxTrocaPersonagens;
            } while (atacante.estaVivo() && defensor.estaVivo());

            console.log(this.verificarVencedor(atacante, defensor));
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
  private encontrarPersonagem(id: number): Personagem | undefined {
    return this.personagens.find((p) => p.id === id);
  }

  private existePersonagemComId(id: number): boolean {
    return this.encontrarPersonagem(id) ? true : false;
  }

  public turno(atacanteId: number, defensorId: number): Acao[] {
    const atacante = this.encontrarPersonagem(atacanteId);
    const defensor = this.encontrarPersonagem(defensorId);

    if (!atacante || !defensor) {
      console.error("Atacante ou defensor não encontrado.");
      return [];
    }

    if (atacanteId === defensorId) {
      console.error("Um personagem não pode atacar a si mesmo.");
      return [];
    }

    const acao = atacante.atacar(defensor);
    defensor.receberDano(atacante.ataqueBase);
    this.adicionarAcao(acao);
    return [acao];
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
const p1 = new Guerreiro(1, "Guerreiro 1", 5, 2);
const p2 = new Guerreiro(2, "Guerreiro 2", 5, 2);
batalha.adicionarPersonagem(p1);
batalha.adicionarPersonagem(p2);
batalha.menu();
