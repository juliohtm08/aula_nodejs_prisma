const { Router } = require('express');
const prisma = require('../database');

const router = Router();

// GET /api/posts
router.get('/', async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { created_at: 'desc' },
  });
  res.json(posts);
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
  const { title, slug, content, published, authorId } = req.body;

  const newPost = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      published,
      authorId,
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
    },
  });
  res.json(post);
});

// PUT /api/posts/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, slug, content, published } = req.body;

  const updatedPost = await prisma.post.update({
    data: {
      title,
      slug,
      content,
      published,
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
