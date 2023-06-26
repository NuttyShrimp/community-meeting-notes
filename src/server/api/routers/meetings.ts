import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { getUserGuilds } from "~/server/lib/discordFetch";

export const meetingRouters = createTRPCRouter({
  list: publicProcedure.query(({ctx}) => {
    if (!ctx.session?.user.id) return [];

    return ctx.prisma.meeting.findMany({
      where: {
        owner: ctx.session?.user.id
      }
    })
  }),
  get: protectedProcedure.input(z.object({
    id: z.string(),
  })).query(async ({ctx, input}) => {
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: input.id,
      },
    });
    if (!meeting) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No meeting found for this id",
      })
    }

     // validate user is in guild of meeting
    const guilds = await getUserGuilds(ctx.session.user.id);
    const guild = guilds.find(g => g.id === meeting.guildId)
    if (!guild) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not part of the guild where this meeting is being held",
      });
    }
    
    meeting.title = `${guild.name} - ${meeting.title}`

    return {
      ...meeting,
      owner: meeting.owner === ctx.session.user.id,
    };
  }),
  create: protectedProcedure.input(z.object({
    name: z.string(),
    guild: z.string(),
  })).mutation(async ({ctx, input}) => {
    const meeting = await prisma.meeting.findFirst({
      where: {
        owner: ctx.session.user.id,
        title: input.name,
        guildId: input.guild,
      }
    })
    if (meeting) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: "A meeting with the same name already exists for this guild"
      });
    }

    await prisma.meeting.create({
      data: {
        owner: ctx.session.user.id,
        title: input.name,
        guildId: input.guild,
      }
    })
  })
})
