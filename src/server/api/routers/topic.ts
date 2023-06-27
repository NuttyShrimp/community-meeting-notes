import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";

export const topicRouter = createTRPCRouter({
  add: protectedProcedure.input(z.object({
    message: z.string(),
    meetingId: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: input.meetingId,
      }
    });

    if (!meeting) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No meeting found for the topic to be posted to",
      })
    }

    if (meeting.locked) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "This meeting is locked, no new topics are allowed"
      });
    }

    await prisma.topic.create({
      data: {
        userId: ctx.session.user.id,
        meetingId: input.meetingId,
        note: input.message,
      }
    })
  })
})
