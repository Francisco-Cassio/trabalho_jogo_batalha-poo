import { Acao } from "./acao";
import { Personagem } from "./personagem";

class Mago extends Personagem {
  constructor(
    id: number,
    nome: string,
    ataqueBase: number,
    defesaBase: number
  ) {
    super(id, nome, ataqueBase, defesaBase);
  }

  public magiaEspecial(alvo: Personagem): Acao {
    let ataque: Acao = new Acao(this, alvo, "6", 25, new Date());
    this.registrarAcao(ataque);
    this.vida -= 10;
    return ataque;
  }

  public atacar(alvo: Personagem): Acao {
    let ataque: Acao = new Acao(this, alvo, "2", this.ataqueBase, new Date());
    this.registrarAcao(ataque);
    return ataque;
  }
}

export { Mago };
