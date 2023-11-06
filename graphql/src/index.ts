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
      try {
        let users = await prisma.user.findMany();
        let userIds = users.map((user) => user.id);
        let posts = await prisma.post.findMany({
          where: { authorId: { in: userIds } },
        });

        let usersData = users.map((user) => {
          let userPosts = posts.filter((post) => post.authorId == user.id);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            posts: userPosts.map((post) => {
              return { title: post.title, content: post.content };
            }),
          };
        });

        return usersData;
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
