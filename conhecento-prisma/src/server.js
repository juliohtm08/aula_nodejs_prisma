const express = require('express');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const tagRouter = require('./routes/tags');

const app = express();

app.use(express.json());
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/tags', tagRouter);

app.listen(3000, () => console.log('Servidor iniciado!'));
