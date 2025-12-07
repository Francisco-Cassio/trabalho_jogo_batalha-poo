import { Personagem } from "./personagem";
import { Mago } from "./mago";

class Guerreiro extends Personagem {
  constructor(id: number, nome: string) {
    super(id, nome, 25);
    this.defesaBase = 15;
  }
}

export { Guerreiro };
