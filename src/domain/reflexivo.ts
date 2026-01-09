import { Personagem } from "./personagem";

class Reflexivo extends Personagem {
  constructor(id: number, nome: string) {
    super(id, nome, 20);
    this.passiva = "\n   - Ao receber dano, reflete o mesmo valor no atacante.";
  }
}

export { Reflexivo };
