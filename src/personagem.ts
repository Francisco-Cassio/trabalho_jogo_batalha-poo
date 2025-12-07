import { Acao } from "./acao";

class Personagem {
  private _id: number;
  private _nome: string;
  private _vida: number;
  private _ataqueBase: number;
  private _defesaBase: number;
  private _vivo: boolean;
  private _historico: Acao[];

  constructor(id: number, nome: string, ataqueBase: number) {
    this._id = id;
    this._nome = nome;
    this._vida = 100;
    this._ataqueBase = ataqueBase;
    this._defesaBase = 0;
    this._vivo = true;
    this._historico = [];
  }

  public atacar(alvo: Personagem): Acao {
    let ataque: Acao = new Acao(
      this,
      alvo,
      "ataque",
      this.ataqueBase,
      new Date()
    );
    alvo.receberDano(ataque.valorDano);
    this.registrarAcao(ataque);
    return ataque;
  }

  public receberDano(valor: number): void {
    if (this.vida > 0 && valor > 0) {
      this.vida -= valor - this.defesaBase;
    }

    if (this.vida < 0) {
      this.vida = 0;
      this.vivo = false;
    }

    if (this.vida === 0) {
      this.vivo = false;
    }
  }

  public estaVivo() {
    return this.vida > 0;
  }

  public registrarAcao(acao: Acao): void {
    this.historico.push(acao);
  }

  get vida() {
    return this._vida;
  }

  get ataqueBase() {
    return this._ataqueBase;
  }

  get defesaBase() {
    return this._defesaBase;
  }

  get id() {
    return this._id;
  }

  get vivo() {
    return this._vivo;
  }

  get nome() {
    return this._nome;
  }

  get historico() {
    return this._historico;
  }

  set nome(novoNome: string) {
    this._nome = novoNome;
  }

  set vida(novaVida: number) {
    this._vida = novaVida;
  }

  set ataqueBase(novoAtaque: number) {
    this._ataqueBase = novoAtaque;
  }

  set defesaBase(novaDefesa: number) {
    this._defesaBase = novaDefesa;
  }

  set vivo(novoStatus: boolean) {
    this._vivo = novoStatus;
  }

  set historico(novoHistorico: Acao[]) {
    this._historico = novoHistorico;
  }
}

export { Personagem };
