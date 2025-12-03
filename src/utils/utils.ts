export function porcentagemAleatoria(): number {
  let porcentagem: number = Math.floor(Math.random() * 100);
  return porcentagem;
}

export function acertoEventoProbabilidade(porcentagem: number): boolean {
  return porcentagemAleatoria() <= porcentagem;
}
