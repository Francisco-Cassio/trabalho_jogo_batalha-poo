import { Acao } from "./acao";

abstract class Personagem {
  private _id: number;
  private _nome: string;
  private _vida: number;
  private _ataqueBase: number;
  private _defesaBase: number;
  private _vivo: boolean;
  private _historico: Acao[];

  constructor(
    id: number,
    nome: string,
    ataqueBase: number,
    defesaBase: number
  ) {
    this._id = id;
    this._nome = nome;
    this._vida = 20;
    this._ataqueBase = ataqueBase;
    this._defesaBase = defesaBase;
    this._vivo = true;
    this._historico = [];
  }

  public abstract atacar(alvo: Personagem): Acao;

  public receberDano(valor: number): void {
    if (this.vida > 0) {
      this.vida -= valor - this.defesaBase;
    }

    if (this.vida < 0) {
      this.vida = 0;
      this.vivo = false;
    }
  }

  public registrarAcao(acao: Acao): void {
    this._historico.push(acao);
  }

  public estaVivo() {
    return this.vida > 0;
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

  set vida(novaVida: number) {
    this._vida = novaVida;
  }

  set ataqueBase(novoAtaque: number) {
    this._ataqueBase = novoAtaque;
  }

  set vivo(novoStatus: boolean) {
    this._vivo = novoStatus;
  }
}

export { Personagem };
