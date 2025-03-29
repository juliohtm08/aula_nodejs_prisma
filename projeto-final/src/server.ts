import cors from 'cors';
import express from 'express';
import { router } from './router';
import { errorHandlerMiddleware } from './middlewares/errorHandler';

const app = express();

app.use(cors()); // Usa o middleware CORS para permitir requisições de diferentes origens
app.use(express.json());
app.use('/api', router);
app.use(errorHandlerMiddleware); // Usa o middleware de tratamento de erros

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor iniciado em http://localhost:${PORT}/`)
);
