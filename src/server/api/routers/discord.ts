import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getUserGuilds } from "~/server/lib/discordFetch";

export const discordRouter = createTRPCRouter({
  guilds: protectedProcedure.query(async ({ctx}) => {
    const guilds = await getUserGuilds(ctx.session.user.id);
    return guilds ?? [];
  }),
})
