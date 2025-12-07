import { Acao } from "./acao";
import { Personagem } from "./personagem";
import { Mago } from "./mago";

class Guerreiro extends Personagem {
  constructor(
    id: number,
    nome: string,
    ataqueBase: number,
    defesaBase: number
  ) {
    super(id, nome, ataqueBase, defesaBase);
    this.ataques.push("Ataque");
  }

  public atacar(alvo: Personagem): Acao {
    let ataque: Acao = new Acao(
      this,
      alvo,
      "ataque",
      this.ataqueBase,
      new Date()
    );

    if (this.oponenteÉMago(alvo)) {
      ataque.valorDano += 3;
    }

    if (this.vida < this.vida * 0.3) {
      ataque.valorDano = ataque.valorDano * 1.3;
    }

    this.registrarAcao(ataque);
    return ataque;
  }

  public oponenteÉMago(alvo: Personagem) {
    return alvo instanceof Mago;
  }
}

export { Guerreiro };
