import { Router } from "express";
import { auth } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// Get comments for a post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: req.params.postId },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments" });
  }
});

// Create comment
router.post("/", auth, async (req, res) => {
  try {
    const { content, postId } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.userId!,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Error creating comment" });
  }
});

// Update comment
router.put("/:id", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.id },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.authorId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: req.params.id },
      data: {
        content,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: "Error updating comment" });
  }
});

// Delete comment
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.id },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.authorId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.comment.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment" });
  }
});

export { router };
