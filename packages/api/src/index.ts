import { apiRouter } from "./routers/api";
import { authRouter } from "./routers/auth";
import { habitRouter } from "./routers/habit";
import { router } from "./trpc";

export { createTRPCContext } from "./context";

export const appRouter = router({
  api: apiRouter,
  auth: authRouter,
  habit: habitRouter,
});

export type AppRouter = typeof appRouter;
