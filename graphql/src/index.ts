import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Post, PrismaClient } from "@prisma/client";
import DataLoader from "dataloader";
const prisma = new PrismaClient();

const typeDefs = `#graphql
  type Post {
    title: String
    content: String
  }
  type User {
    id: Int
    name: String
    email: String
    posts: [Post]
  }
  type Query {
    users: [User]
  }
`;

type BatchPost = (userIds: readonly number[]) => Promise<Post[][]>;

// DataLoader function to batch and cache post requests
const batchPosts: BatchPost = async (userIds) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: { in: [...userIds] },
    },
  });
  const postsByUserId = userIds.map((userId: number) =>
    posts.filter((post) => post.authorId === userId)
  );
  return postsByUserId;
};

// Create a DataLoader instance for posts
const postsLoader = new DataLoader<number, Post[]>(batchPosts);

const resolvers = {
  User: {
    posts: async (parent: any) => {
      return await postsLoader.load(parent.id);
    },
  },
  Query: {
    users: async () => {
      try {
        return await prisma.user.findMany();
      } catch (e) {
        console.log(e);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
