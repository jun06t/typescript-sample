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
    users(ids: [Int]): [User]
  }
`;

const resolvers = {
  Query: {
    users: async (_: any, args: any) => {
      const whereClause = args.ids ? { id: { in: args.ids } } : {};
      return await prisma.user.findMany({
        where: whereClause,
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
