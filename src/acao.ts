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

  get origem(): Personagem {
    return this._origem;
  }

  get alvo(): Personagem {
    return this._alvo;
  }

  get tipo(): string {
    return this._tipo;
  }

  get valorDano(): number {
    return this._valorDano;
  }

  get dataHora(): Date {
    return this._dataHora;
  }

  set tipo(novoTipo: string) {
    this._tipo = novoTipo;
  }

  set valorDano(novoDano: number) {
    this._valorDano = novoDano;
  }

  toString() {
    return (
      "🔰 Origem: " +
      this.origem.nome +
      "\n🎯 Alvo: " +
      this.alvo.nome +
      "\n⚙️ Tipo: " +
      this.tipo +
      "\n🩹 Valor do Dano: " +
      this.valorDano +
      "\n⌚ Data e Hora da Ação: " +
      this.dataHora.toLocaleString()
    );
  }
}

export { Acao };
