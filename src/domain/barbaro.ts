import { Personagem } from "./personagem";

class Barbaro extends Personagem {
  constructor(id: number, nome: string) {
    super(id, nome, 35);
    this.passiva =
      "\n   - Causa dano extra igual a 10% do dano que ele recebeu na rodada anterior.";
  }
}

export { Barbaro };
