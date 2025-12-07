import { Personagem } from "./personagem";

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

  set valorDano(novoDano: number) {
    this._valorDano = novoDano;
  }

  get valorDano(): number {
    return this._valorDano;
  }

  get tipo(): string {
    return this._tipo;
  }

  set tipo(novoTipo: string) {
    this._tipo = novoTipo;
  }

  toString() {
    return (
      "origem: " +
      this._origem.id +
      ", alvo: " +
      this._alvo.id +
      ", tipo: " +
      this._tipo +
      ", valorDano: " +
      this._valorDano +
      ", dataHora: " +
      this._dataHora.toLocaleString()
    );
  }
}

export { Acao };
