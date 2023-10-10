import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

const prisma = new PrismaClient();

app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
      },
    });
    return res.json(users);
  } catch (e) {
    const code = handlePrismaError(e);
    return res.status(code).json(e);
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        posts: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (e) {
    const code = handlePrismaError(e);
    return res.status(code).json(e);
  }
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return res.json(user);
  } catch (e) {
    const code = handlePrismaError(e);
    return res.status(code).json(e);
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return res.json(user);
  } catch (e) {
    const code = handlePrismaError(e);
    return res.status(code).json(e);
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    return res.json(user);
  } catch (e) {
    const code = handlePrismaError(e);
    return res.status(code).json(e);
  }
});

app.get("/posts", async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany();
  return res.json(posts);
});

app.get("/posts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.json(post);
  } catch (e) {
    const code = handlePrismaError(e);
    return res.status(code).json(e);
  }
});

app.post("/posts", async (req: Request, res: Response) => {
  const { title, content, published, authorId } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId,
      },
    });
    return res.json(post);
  } catch (e) {
    const code = handlePrismaError(e);
    return res.status(code).json(e);
  }
});

app.put("/posts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, content, published } = req.body;
  try {
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        published,
      },
    });
    return res.json(post);
  } catch (e) {
    const code = handlePrismaError(e);
    return res.status(code).json(e);
  }
});

app.delete("/posts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.delete({
      where: {
        id,
      },
    });
    return res.json(post);
  } catch (e) {
    const code = handlePrismaError(e);
    return res.status(code).json(e);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

const handlePrismaError = (e: any) => {
  switch (e.code) {
    case "P2002":
      return 400;
    case "P2023":
      return 400;
    case "P2025":
      return 404;
    default:
      console.log(e);
      return 500;
  }
};
