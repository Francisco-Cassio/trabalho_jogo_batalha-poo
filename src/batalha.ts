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
    let nome: string = this.input("Nome: ");

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
              let guerreio = new Guerreiro(id, nome, 5, 2);
              this.adicionarPersonagem(guerreio);
              break;
            case "2":
              nome = this.input("Nome: ");
              let mago = new Mago(id, nome, 3, 4);
              this.adicionarPersonagem(mago);
            case "3":
              nome = this.input("Nome: ");
              let arqueiro = new Arqueiro(id, nome, 4, 3);
              this.adicionarPersonagem(arqueiro);
          }
          break;

        case "02":
          let atacanteId: number = parseInt(this.input("ID do jogador 1: "));
          let defensorId: number = parseInt(this.input("ID do jogador 2: "));

          if ((atacanteId && defensorId) in this._personagens) {
            const atacante = this._personagens.find((p) => p.id === atacanteId);
            const defensor = this._personagens.find((p) => p.id === defensorId);

            do {
              this.turno(atacanteId, defensorId);
            } while (!atacante?.estaVivo || !defensor?.estaVivo);

            this.verificarVencedor();
          }

          break;

        case "03":
          this.listarPersonagens();
          break;
        case "04":
          this.listarAcoes();
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
    this._personagens.push(p);
  }

  public turno(atacanteId: number, defensorId: number): Acao[] {
    const atacante = this._personagens.find((p) => p.id === atacanteId);
    const defensor = this._personagens.find((p) => p.id === defensorId);

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
    this._acoes.push(acao);

    return [acao];
  }

  public listarPersonagens(): Personagem[] {
    return this._personagens;
  }

  public listarAcoes(): Acao[] {
    return this._acoes;
  }

  public verificarVencedor(): Personagem | null {
    const personagensVivos = this._personagens.filter((p) => p.estaVivo(p));

    if (personagensVivos.length === 1) {
      return personagensVivos[0];
    }
    return null;
  }
}
