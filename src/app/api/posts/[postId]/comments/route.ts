import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 5;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: { 
        postId,
        parentId: null // This fetches only top-level comments
      },
      include: {
        ...getCommentDataInclude(user.id),
        replies: {
          include: getCommentDataInclude(user.id),
        },
      },
      orderBy: { createdAt: "desc" },
      take: -pageSize  -1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = comments.length > pageSize;
    const nextCursor = hasNextPage ? comments[pageSize - 1].id : null;

    const data: CommentsPage = {
      comments: comments.slice(0, pageSize),
      nextCursor,
      previousCursor: null,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
