import type { Express, Request, Response } from "express";
import express from "express";
import mongoose from "mongoose";

const app: Express = express();
const port = process.env.port || 8000;

app.get("/", (req: Request, res: Response) => {
  setTimeout(() => {
    res.end("Hello world");
  }, 10000);
});

const server = require("http").createServer(app);

server.listen(port, () => {
  console.log("Express server listening on port " + server.address().port);
});

process.on("SIGINT", () => {
  console.info("SIGINT signal received.");

  server.close((err: any) => {
    console.log("Http server closed.");
    if (err) {
      console.error(err);
      process.exit(1);
    }

    mongoose.connection.close(false).then(() => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});
