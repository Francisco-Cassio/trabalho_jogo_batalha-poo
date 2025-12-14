import { Acao } from "./acao";

class Personagem {
  private _id: number;
  private _nome: string;
  private _vida: number;
  private _ataqueBase: number;
  private _defesaBase: number;
  private _vivo: boolean;
  private _historico: Acao[];
  private _passiva: string;
  private _danoCausadoTotal: number;
  private _danoRecebidoTotal: number;
  private _abates: number;

  constructor(id: number, nome: string, ataqueBase: number) {
    this._id = id;
    this._nome = nome;
    this._vida = 100;
    this._ataqueBase = ataqueBase;
    this._defesaBase = 0;
    this._vivo = true;
    this._historico = [];
    this._passiva = "";
    this._danoCausadoTotal = 0;
    this._danoRecebidoTotal = 0;
    this._abates = 0;
  }

  public atacar(alvo: Personagem): Acao {
    if (!this.estaVivo()) {
      throw new Error(
        `\n❌ ${this.constructor.name} ${this.nome} não pode atacar, pois está morto.`
      );
    }

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

  public registrarDanoCausado(dano: number): void {
    this._danoCausadoTotal += dano;
  }

  public registrarDanoRecebido(dano: number): void {
    this._danoRecebidoTotal += dano;
  }

  public registrarAbate(): void {
    this._abates += 1;
  }

  public receberDano(valor: number): void {
    if (!this.estaVivo()) {
      throw new Error(
        `\n❌ ${this.constructor.name} ${this.nome} já está morto(a) e não pode receber mais dano.`
      );
    }
    const danoEfetivo = Math.max(0, valor - this.defesaBase);

    if (danoEfetivo > 0) {
      this.vida -= danoEfetivo;
      this.registrarDanoRecebido(danoEfetivo);
    }
    if (this.vida <= 0) {
      this.vida = 0;
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

  get passiva() {
    return this._passiva;
  }

  get danoCausadoTotal() {
    return this._danoCausadoTotal;
  }
  get danoRecebidoTotal() {
    return this._danoRecebidoTotal;
  }
  get abates() {
    return this._abates;
  }

  set nome(novoNome: string) {
    this._nome = novoNome;
  }

  set id(novoId: number) {
    this._id = novoId;
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

  set passiva(novaPassiva: string) {
    this._passiva = novaPassiva;
  }

  toString() {
    return (
      `👤 ${this.nome} - ${this.constructor.name}\n` +
      "\n • ID: " +
      this.id +
      "\n • Vida: " +
      this.vida +
      "\n • Ataque: " +
      this.ataqueBase +
      "\n • Defesa: " +
      this.defesaBase +
      "\n • Passiva: " +
      this.passiva
    );
  }
  public toJSON() {
    return {
      classe: this.constructor.name,
      id: this._id,
      nome: this._nome,
      vida: this._vida,
      ataqueBase: this._ataqueBase,
      defesaBase: this._defesaBase,
      vivo: this._vivo,
      passiva: this._passiva,
      danoCausadoTotal: this._danoCausadoTotal,
      danoRecebidoTotal: this._danoRecebidoTotal,
      abates: this._abates,
    };
  }
}

export { Personagem };
