import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());

const prisma = new PrismaClient();

app.get("/", (req: Request, res: Response) => res.send("Hello World!"));

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  return res.json(users);
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return res.json(user);
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });
  return res.json(user);
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
    return res.status(400).json(e);
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
    return res.status(400).json(e);
  }
});

app.get("/posts", async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany();
  return res.json(posts);
});

app.post("/posts", async (req: Request, res: Response) => {
  const { title, content, published, authorId } = req.body;
  const post = await prisma.post.create({
    data: {
      title,
      content,
      published,
      authorId,
    },
  });
  return res.json(post);
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
    return res.status(400).json(e);
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
    return res.status(400).json(e);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
