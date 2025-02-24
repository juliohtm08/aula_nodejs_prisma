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
