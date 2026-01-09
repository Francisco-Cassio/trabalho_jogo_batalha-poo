class AtaqueNaoPermitidoException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtaqueNaoPermitidoException";
  }
}

export { AtaqueNaoPermitidoException };
