import { Personagem } from "./personagem";

class Guerreiro extends Personagem {
  constructor(id: number, nome: string) {
    super(id, nome, 25);
    this.defesaBase = 15;
    this.passiva =
      "\n   - Se a vida cair abaixo de 30%, recebe +30% de dano, arredondado para baixo" +
      "\n   - Ataques com valor menor que seu ataque não causam dano nele.";
  }
}

export { Guerreiro };
