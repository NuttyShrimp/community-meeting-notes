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
  }),
  get: protectedProcedure.input(z.object({
    meetingId: z.string(),
  })).query(({ input }) => {
    return prisma.topic.findMany({
      where: {
        meetingId: input.meetingId,
      },
      include: {
        user: true,
      }
    })
  }),
  delete: protectedProcedure.input(z.object({
    topicId: z.number(),
  })).mutation(async ({ ctx, input }) => {
    const topic = await prisma.topic.findFirst({
      where: {
        id: input.topicId,
        OR: [
          {
            userId: ctx.session.user.id,
          },
          {
            meeting: {
              owner: ctx.session.user.id
            }
          }
        ]
      }
    });

    if (!topic) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have the rights to do that"
      });
    }

    await prisma.topic.delete({
      where: {
        id: input.topicId
      }
    })
  }),

  // TODO: move to seperate router
  addComment: protectedProcedure.input(z.object({
    topicId: z.number(),
    comment: z.string(),
  })).mutation(async ({ ctx, input }) => {
    await prisma.topicComment.create({
      data: {
        topicId: input.topicId,
        note: input.comment,
        userId: ctx.session.user.id
      }
    })
  }),
  getComments: protectedProcedure.input(z.object({
    topicId: z.number()
  })).query(async ({ input }) => {
    return await prisma.topicComment.findMany({
      where: {
        topicId: input.topicId,
      },
      include: {
        user: true
      }
    })
  }),
  deleteComment: protectedProcedure.input(z.object({
    commentId: z.number()
  })).mutation(async ({ ctx, input }) => {
    const meeting = await prisma.topicComment.findFirst({
      where: {
        id: input.commentId,
        topic: {
          meeting: {
            owner: ctx.session.user.id,
          }
        }
      }
    })
    if (!meeting) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You cannot do this operation"
      })
    }
    await prisma.topicComment.delete({
      where: {
        id: input.commentId,
      }
    })
  })
})
