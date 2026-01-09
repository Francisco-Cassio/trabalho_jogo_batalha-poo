import { Personagem } from "./personagem";

class Eterno extends Personagem {
  constructor(id: number, nome: string) {
    super(id, nome, 20);
    this.passiva =
      "\n   - Nenhum ataque funciona nele a não ser de outro Eterno.";
  }
}

export { Eterno };
