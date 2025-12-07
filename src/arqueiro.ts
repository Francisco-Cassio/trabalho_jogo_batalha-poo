import { Acao } from "./acao";
import { Personagem } from "./personagem";
import { acertoEventoProbabilidade } from "./utils/utils";

class Arqueiro extends Personagem {
  constructor(
    id: number,
    nome: string,
    ataqueBase: number,
    defesaBase: number
  ) {
    super(id, nome, ataqueBase, defesaBase);
    this.ataques.push("Ataque");
    this.ataques.push("Ataque Duplo");
  }

  public ataqueDuplo(alvo: Personagem): Acao {
    let danoAtaqueDuplo = this.ataqueBase * 2;
    let ataque: Acao = new Acao(
      this,
      alvo,
      "ataque duplo",
      danoAtaqueDuplo,
      new Date()
    );
    this.registrarAcao(ataque);
    return ataque;
  }

  public atacar(alvo: Personagem): Acao {
    let ataque: Acao = new Acao(
      this,
      alvo,
      "ataque",
      this.ataqueBase,
      new Date()
    );
    if (acertoEventoProbabilidade(15)) {
      ataque.valorDano *= 1.5;
      ataque.tipo = "crítico";
    }
    this.registrarAcao(ataque);
    return ataque;
  }
}

export { Arqueiro };
