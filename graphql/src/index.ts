import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const typeDefs = `#graphql
  type User {
    id: Int
    name: String
    email: String
    age: Int
    isAdult: Boolean
  }
  type Query {
    users: [User]
    userById(id: Int): User
    userByEmail(email: String): User
  }
`;

const resolvers = {
  User: {
    isAdult: (parent: any) => {
      return parent.age >= 18;
    },
  },
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    userById: async (_: any, args: any) => {
      console.log(args);
      return await prisma.user.findUnique({
        where: { id: args.id },
      });
    },
    userByEmail: async (_: any, args: any) => {
      console.log(args);
      return await prisma.user.findUnique({
        where: { email: args.email },
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
