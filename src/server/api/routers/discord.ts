import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { fetchFromDiscord } from "~/server/lib/discordFetch";

export const discordRouter = createTRPCRouter({
  guilds: protectedProcedure.query(async ({ctx}) => {
    const guilds = await fetchFromDiscord<Discord.Guild[]>("users/@me/guilds", ctx.session.user.id);
    return guilds ?? [];
  })
})
