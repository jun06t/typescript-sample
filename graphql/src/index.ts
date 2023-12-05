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
  Query: {
    users: async () => {
      return await prisma.user.findMany({
        include: {
          posts: true,
        },
      });
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
