import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";
import { emailRouter } from "./routes/email";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
