import { Personagem } from "../domain/personagem";

class Acao {
  private _origem: Personagem;
  private _alvo: Personagem;
  private _tipo: string;
  private _valorDano: number;
  private _dataHora: Date;

  constructor(
    origem: Personagem,
    alvo: Personagem,
    tipo: string,
    valorDano: number,
    dataHora: Date
  ) {
    this._origem = origem;
    this._alvo = alvo;
    this._tipo = tipo;
    this._valorDano = valorDano;
    this._dataHora = dataHora;
  }

  get origem() {
    return this._origem;
  }
  get alvo() {
    return this._alvo;
  }
  get tipo() {
    return this._tipo;
  }
  get valorDano() {
    return this._valorDano;
  }
  get dataHora() {
    return this._dataHora;
  }

  toString(): string {
    if (this.tipo === "ataque") {
      return `⚔️ ${this.origem.nome} causou ${this.valorDano} de dano em ${this.alvo.nome}.`;
    } else if (this.tipo === "autodano") {
      return `🩸 ${this.origem.nome} sofreu ${this.valorDano} de dano (autodano).`;
    }
    return `${this.tipo} de ${this.origem.nome} em ${this.alvo.nome} (${this.valorDano})`;
  }

  public toJSON() {
    return {
      origemNome: this.origem.nome,
      alvoNome: this.alvo.nome,
      tipo: this.tipo,
      valorDano: this.valorDano,
      dataHora: this.dataHora,
    };
  }
}

export { Acao };
