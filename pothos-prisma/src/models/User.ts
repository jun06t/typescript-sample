import { builder } from "../builder";
import { prisma } from "../db";

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    messages: t.relation("messages"),
  }),
});

builder.queryField("users", (t) =>
  t.prismaField({
    type: ["User"],
    resolve: async (query, root, args, ctx, info) => {
      return prisma.user.findMany({ ...query });
    },
  })
);

builder.mutationField("createUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      name: t.arg.string(),
    },
    resolve: async (query, root, args, ctx, info) => {
      if (!args.name) {
        throw new Error("name is required");
      }
      return prisma.user.create({
        data: {
          name: args.name,
        },
      });
    },
  })
);
