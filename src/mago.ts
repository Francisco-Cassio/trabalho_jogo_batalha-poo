import { Personagem } from "./personagem";

class Mago extends Personagem {
  constructor(id: number, nome: string) {
    super(id, nome, 30);
  }
}

export { Mago };
