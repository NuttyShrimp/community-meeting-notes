import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";

export const exportRouter = createTRPCRouter({
  md: protectedProcedure.input(z.object({
    meetingId: z.string()
  })).query(async ({ input, ctx }) => {
    const meeting = await prisma.meeting.findFirst({
      where: {
        id: input.meetingId,
      },
      include: {
        Topic: {
          include: {
            TopicComment: {
              include: {
                user: true,
              }
            },
            user: true,
          }
        },
        user: true,
      }
    });
    if (!meeting) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The meeting you wanted to export does not exists"
      })
    }

    let file_contents = `# ${meeting.title}`;
    for (const topic of meeting.Topic) {
      file_contents = `${file_contents}
      - ${topic.note} (${topic.user.name ?? "Unknown user"})`
      for (const comment of topic.TopicComment) {
        file_contents = `${file_contents}
        - ${comment.note} (${comment.user.name ?? "Unknown user"})
        `
      }
    }

    return file_contents
  })
})
