import { Personagem } from "./personagem";

class Exausto extends Personagem {
  constructor(id: number, nome: string) {
    super(id, nome, 50);
    this.passiva = "\n   - A cada ataque, seu ataque cai pela metade até 1.";
  }
}

export { Exausto };
