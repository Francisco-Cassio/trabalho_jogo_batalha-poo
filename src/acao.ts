import { Personagem } from "./personagem";

class Acao {
  private _origem: Personagem;
  private _alvo: Personagem;
  private _origemNome: string;
  private _alvoNome: string;
  private _tipo: string;
  private _valorDano: number;
  private _dataHora: Date;

  constructor(
    origem: Personagem,
    alvo: Personagem,
    tipo: string,
    valorDano: number,
    dataHora: Date | string
  ) {
    this._origem = origem;
    this._alvo = alvo;
    this._origemNome = origem.nome;
    this._alvoNome = alvo.nome;
    this._tipo = tipo;
    this._valorDano = valorDano;
    this._dataHora =
      typeof dataHora === "string" ? new Date(dataHora) : dataHora;
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

  get origemNome(): string {
    return this._origemNome;
  }

  get alvoNome(): string {
    return this._alvoNome;
  }

  set tipo(novoTipo: string) {
    this._tipo = novoTipo;
  }

  set valorDano(novoDano: number) {
    this._valorDano = novoDano;
  }

  set dataHora(novaData: Date) {
    this._dataHora = novaData;
  }

  toString() {
    return (
      "🔰 Origem: " +
      this._origemNome +
      "\n🎯 Alvo: " +
      this._alvoNome +
      "\n⚙️ Tipo: " +
      this.tipo +
      "\n🩹 Valor do Dano: " +
      this.valorDano +
      "\n⌚ Data e Hora da Ação: " +
      this.dataHora.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    );
  }

  public toJSON() {
    return {
      origemNome: this._origemNome,
      alvoNome: this._alvoNome,
      tipo: this._tipo,
      valorDano: this._valorDano,
      dataHora: this._dataHora.toISOString(),
    };
  }
}

export { Acao };
