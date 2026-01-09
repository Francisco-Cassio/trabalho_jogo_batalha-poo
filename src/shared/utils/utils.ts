import { Personagem } from "../../domain/personagem";

export function porcentagemAleatoria(): number {
  let porcentagem: number = Math.floor(Math.random() * 100);
  return porcentagem;
}

export function acertoEventoProbabilidade(porcentagem: number): boolean {
  return porcentagemAleatoria() <= porcentagem;
}

export function sorteio(lista: Personagem[]): Personagem {
  return lista[Math.floor(Math.random() * lista.length)];
}
