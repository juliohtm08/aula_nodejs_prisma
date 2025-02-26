const { Router } = require('express');
const prisma = require('../database');

const router = Router();

// GET /api/posts
router.get('/', async (req, res) => {
  // aqui caso o número da página não seja inserido, por padrão assumirá como página 1
  const page = +req.query.page || 1;
  // aqui caso o número de posts por página não for inserido, por padrão retornarão 10 posts por página
  const pageSize = +req.query.pageSize || 10;

  // aqui é o calculo de quantos posts iremos pular
  // por exemplo, se estivermos na página 1 não queremos pular/ignorar nenhum dado,
  // mas se estivermos na página 2, iremos pular, por padrão, 10 posts
  const skip = (page - 1) * pageSize;
  // aqui é basicamente a quantidade de posts que queremos pegar, por padrão são 10 posts
  const take = pageSize;

  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      created_at: 'desc',
    },
    take, // take é a quantidade de valores que queremos pegar, neste caso, por padrão 10 posts por página
    skip, // skip é a quantidade de valores que iremos pular, por exemplo, se estivermos na página 2, todos os valores da página 1 serão pulados/ignorados
  });

  const totalPosts = await prisma.post.count({ where: { published: true } }); // calcula o total de posts que foi publicado
  const totalPages = Math.ceil(totalPosts / pageSize); //calcula o total de páginas

  res.json({
    posts,
    pagination: {
      page, // qual página estamos
      pageSize, // quantidade de posts por página
      totalPages, // total de páginas
      totalPosts, // total de posts
    },
  });
});

// GET /api/posts/search
router.get('/search', async (req, res) => {
  const { title, authorId, published, startDate, endDate } = req.query;

  const filter = {};

  // filtragem pelo nome do post
  if (title) {
    filter.title = {
      contains: title,
      mode: 'insensitive', // Não faz a diferenciação de letra maiúscula e minúscula
    };
  }

  // filtragem pelo id do autor
  if (authorId) {
    filter.authorId = +authorId;
  }

  // filtragem pela publicação(se foi publicada ou não)
  if (published) {
    filter.published = published === 'true';
  }

  // filtragem por datas
  if (startDate || endDate) {
    filter.created_at = {};

    if (startDate) {
      filter.created_at.gte = new Date(startDate); // gte é o maior ou igual (<=)
    }
    if (endDate) {
      filter.created_at.lte = new Date(endDate); // lte é o menor ou igual (>=)
    }
  }

  console.log(`Filtros: ${filter}`);

  const posts = await prisma.post.findMany({
    where: filter,
    orderBy: {
      created_at: 'desc',
    },
  });
  res.json(posts);
});

// GET /api/posts
router.post('/', async (req, res) => {
  const { title, slug, content, published, authorId, tags } = req.body;

  const newPost = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      published,
      authorId,
      tags: {
        connect: tags,
      },
    },
  });
  res.status(201).json(newPost);
});

// GET /api/posts/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: +id,
    },
    include: {
      author: true,
      tags: true,
    },
  });
  res.json(post);
});

// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  /* const { title, slug, content, published } = req.body; */

  const updatedPost = await prisma.post.update({
    data: {
      ...req.body,
      /*       title,
      slug,
      content,
      published, */
      tags: {
        set: req.body.tags,
      },
    },
    where: {
      id: +id,
    },
  });
  res.json(updatedPost);
});

// DELETE /api/posts/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deletedPost = await prisma.post.delete({
    where: {
      id: +id,
    },
  });
  res.json({ deletedPost });
});

module.exports = router;
