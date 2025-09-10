import { Router } from "express";
import { auth } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// Get user's posts
router.get("/user", auth, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: req.userId!,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user posts" });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create post
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.userId!,
        published: true,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Update post
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: req.params.id },
      data: { title, content },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete all comments first
    await prisma.comment.deleteMany({
      where: { postId: req.params.id },
    });

    // Then delete the post
    await prisma.post.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({
      message: err instanceof Error ? err.message : "Error deleting post",
    });
  }
});

export { router };
