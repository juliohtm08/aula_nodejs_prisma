import { ErrorRequestHandler } from 'express';
import { HttpError } from '../errors/HttpError';

// Middleware para tratamento de erros
export const errorHandlerMiddleware: ErrorRequestHandler = (
  error, // O erro capturado
  req, // Objeto de requisição do Express
  res, // Objeto de resposta do Express
  next // Função para passar o controle ao próximo middleware
) => {
  // Verifica se o erro é uma instância de HttpError
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message }); // Se for, retorna a resposta com o status e a mensagem do erro
  }
  // Verifica se o erro é uma instância de Error (erro genérico)
  else if (error instanceof Error) {
    res.status(500).json({ message: error.message }); // Se for, retorna uma resposta com status 500 e a mensagem do erro
  }
  // Caso o erro não seja uma instância de Error ou HttpError
  else {
    res.status(500).json({ message: 'Erro interno no servidor desconhecido' }); // Retorna uma resposta com status 500 e uma mensagem genérica de erro
  }
};
