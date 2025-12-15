import { Personagem } from "./personagem";
import { Acao } from "./acao";

class BatalhaCompleta {
  private _id: number;
  private _dataFim: Date;
  private _participantes: Personagem[];
  private _acoes: Acao[];
  private _vencedor: Personagem | null;

  constructor(
    id: number,
    participantes: Personagem[],
    acoes: Acao[],
    vencedor: Personagem | null
  ) {
    this._id = id;
    this._dataFim = new Date();
    this._participantes = participantes;
    this._acoes = acoes;
    this._vencedor = vencedor;
  }

  get id() {
    return this._id;
  }
  get dataFim() {
    return this._dataFim;
  }
  get participantes() {
    return this._participantes;
  }
  get acoes() {
    return this._acoes;
  }
  get vencedor() {
    return this._vencedor;
  }

  public toJSON() {
    return {
      id: this._id,
      dataFim: this._dataFim.toISOString(),
      participantes: this._participantes.map((p) => ({
        nome: p.nome,
        classe: p.constructor.name,
        vidaFinal: p.vida,
        danoCausadoTotal: p.danoCausadoTotal,
        abates: p.abates,
      })),
      acoes: this._acoes.map((a) => a.toJSON()),
      vencedor: this._vencedor
        ? { nome: this._vencedor.nome, classe: this._vencedor.constructor.name }
        : null,
    };
  }
}

export { BatalhaCompleta };
