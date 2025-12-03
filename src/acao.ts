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
}

export { Acao };
