// Definição de uma classe personalizada para erros HTTP que estende a classe nativa Error
export class HttpError extends Error {
  status: number; // Propriedade adicional para armazenar o status HTTP do erro

  // Construtor da classe que recebe o status e a mensagem do erro
  constructor(status: number, message: string) {
    super(message); // Chama o construtor da classe Error com a mensagem
    this.status = status; // Atribui o status recebido à propriedade status
  }
}
