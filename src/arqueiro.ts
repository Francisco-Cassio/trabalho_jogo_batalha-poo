import { Personagem } from "./personagem";

class Arqueiro extends Personagem {
  private _ataqueMultiplo: number;

  constructor(id: number, nome: string) {
    super(id, nome, 15);
    this._ataqueMultiplo = 3;
  }

  get ataqueMultiplo() {
    return this._ataqueMultiplo;
  }
}

export { Arqueiro };
