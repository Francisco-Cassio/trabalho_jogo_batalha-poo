import { Personagem } from "./personagem";

class Mago extends Personagem {
  constructor(id: number, nome: string) {
    super(id, nome, 30);
    this.passiva =
      "\n   - Ataques ignoram defesa de guerreiros." +
      "\n   - Causa dano dobrado em arqueiros." +
      "\n   - Cada ataque feito custa 10 de vida ao mago.";
  }
}

export { Mago };
