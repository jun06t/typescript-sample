import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
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

const resolvers = {
  User: {
    posts: async (parent: any) => {
      return await prisma.post.findMany({
        where: { authorId: parent.id },
      });
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
