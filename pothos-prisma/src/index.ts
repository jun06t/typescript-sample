import { createYoga } from "graphql-yoga";
import { createServer } from "node:http";
import { schema } from "./schema";

const port = Number(process.env.API_PORT) || 3000;
const yoga = createYoga({
  schema: schema,
});
const server = createServer(yoga);

server.listen(port, () => {
  console.log("Visit http://localhost:3000/graphql");
});
