import { apiRouter } from "./routers/api";
import { authRouter } from "./routers/auth";
import { habitRouter } from "./routers/habits";
import { router } from "./trpc";

export { createTRPCContext } from "./context";

export const appRouter = router({
  api: apiRouter,
  auth: authRouter,
  habits: habitRouter,
});

export type AppRouter = typeof appRouter;
