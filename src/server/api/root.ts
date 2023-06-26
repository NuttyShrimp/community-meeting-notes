import { createTRPCRouter } from "~/server/api/trpc";
import { meetingRouters } from "./routers/meetings";
import { discordRouter } from "./routers/discord";
import { topicRouter } from "./routers/topic";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  meetings: meetingRouters,
  discord: discordRouter,
  topics: topicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
