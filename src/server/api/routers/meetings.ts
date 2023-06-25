import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";

export const meetingRouters = createTRPCRouter({
  list: publicProcedure.query(({ctx}) => {
    if (!ctx.session?.user.id) return [];

    return ctx.prisma.meeting.findMany({
      where: {
        owner: ctx.session?.user.id
      }
    })
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
