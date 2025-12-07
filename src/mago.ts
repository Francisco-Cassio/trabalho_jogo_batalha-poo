import { Acao } from "./acao";
import { Personagem } from "./personagem";
import { acertoEventoProbabilidade } from "./utils/utils";

class Mago extends Personagem {
  constructor(
    id: number,
    nome: string,
    ataqueBase: number,
    defesaBase: number
  ) {
    super(id, nome, ataqueBase, defesaBase);
    this.ataques.push("Magia");
    this.ataques.push("Magia Especial");
  }

  public magiaEspecial(alvo: Personagem): Acao {
    let ataque: Acao;
    if (acertoEventoProbabilidade(30)) {
      ataque = new Acao(this, alvo, "magia especial", 25, new Date());
      this.vida -= 10;
    } else {
      console.log("\nO ataque não surtiu efeito.");
      ataque = new Acao(this, alvo, "magia especial", 0, new Date());
    }
    this.registrarAcao(ataque);
    return ataque;
  }

  public atacar(alvo: Personagem): Acao {
    let ataque: Acao = new Acao(
      this,
      alvo,
      "magia",
      this.ataqueBase,
      new Date()
    );
    this.registrarAcao(ataque);
    return ataque;
  }
}

export { Mago };
