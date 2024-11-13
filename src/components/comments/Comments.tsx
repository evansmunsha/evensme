import kyInstance from "@/lib/ky";
import { CommentData, CommentsPage, PostData } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import Loading from "@/app/(main)/loading";

interface CommentsProps {
  post: PostData;
  comment: CommentData;
}

export default function Comments({ comment,post }: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", comment],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${comment}/replylikes`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // Remove the select function if you want to keep the original order
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];

  const renderComment = (comment: CommentData) => (
    <div key={comment.id} className="mb-4">
      <Comment comment={comment} post={post} />
      
    </div>
  );

  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loading />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments.map((renderComment))}
      </div>
    </div>
  );
}
