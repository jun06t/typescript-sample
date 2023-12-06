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

const isAdult = (age: number) => {
  return age >= 18 ? true : false;
};

const resolvers = {
  Query: {
    users: async () => {
      const user = await prisma.user.findMany();
      return user.map((u) => {
        return {
          ...u,
          isAdult: isAdult(u.age),
        };
      });
    },
    userById: async (_: any, args: any) => {
      const user = await prisma.user.findUnique({
        where: { id: args.id },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return {
        ...user,
        isAdult: isAdult(user.age),
      };
    },
    userByEmail: async (_: any, args: any) => {
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return {
        ...user,
        isAdult: isAdult(user.age),
      };
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
