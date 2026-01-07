import { Acao } from "./acao";

class Personagem {
  private _id: number;
  private _nome: string;
  private _vida: number;
  private _ataqueBase: number;
  private _ataqueBaseInicial: number;
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
    this._ataqueBaseInicial = ataqueBase;
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

    const ataque = new Acao(this, alvo, "ataque", this.ataqueBase, new Date());
    this.registrarAcao(ataque);
    return ataque;
  }

  public registrarDanoCausado(dano: number): void {
    this.danoCausadoTotal += dano;
  }

  public registrarDanoRecebido(dano: number): void {
    this.danoRecebidoTotal += dano;
  }

  public registrarAbate(): void {
    this.abates += 1;
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

      if (this.vida <= 0) {
        this.vida = 0;
        this.vivo = false;
      }
    }
  }

  public estaVivo(): boolean {
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
  get ataqueBaseInicial() {
    return this._ataqueBaseInicial;
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

  set vida(v: number) {
    this._vida = v;
  }
  set ataqueBase(v: number) {
    this._ataqueBase = v;
  }
  set ataqueBaseInicial(v: number) {
    this._ataqueBaseInicial = v;
  }
  set defesaBase(v: number) {
    this._defesaBase = v;
  }
  set vivo(v: boolean) {
    this._vivo = v;
  }
  set nome(v: string) {
    this._nome = v;
  }
  set historico(v: Acao[]) {
    this._historico = v;
  }
  set passiva(v: string) {
    this._passiva = v;
  }
  set danoCausadoTotal(v: number) {
    this._danoCausadoTotal = v;
  }
  set danoRecebidoTotal(v: number) {
    this._danoRecebidoTotal = v;
  }
  set abates(v: number) {
    this._abates = v;
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
      id: this.id,
      nome: this.nome,
      vida: this.vida,
      ataqueBase: this.ataqueBase,
      defesaBase: this.defesaBase,
      vivo: this.vivo,
      passiva: this.passiva,
      danoCausadoTotal: this.danoCausadoTotal,
      danoRecebidoTotal: this.danoRecebidoTotal,
      abates: this.abates,
    };
  }
}

export { Personagem };
