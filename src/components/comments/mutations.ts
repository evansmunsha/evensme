import { CommentsPage, CommentData } from "@/lib/types";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { deleteComment, submitComment } from "./actions";

export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const queryKey: QueryKey = ["comments", postId];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          const ensureCommentStructure = (comment: any): CommentData => ({
            ...comment,
            _count: comment._count || { replies: 0 },
            replies: comment.replies?.map(ensureCommentStructure) || [],
          });

          const updateComments = (comments: any[]): CommentData[] => {
            if (newComment.parentId) {
              return comments.map(comment => {
                const updatedComment = ensureCommentStructure(comment);
                if (updatedComment.id === newComment?.parentId) {
                  return {
                    ...updatedComment,
                    replies: [ensureCommentStructure(newComment), ...updatedComment.replies],
                    _count: {
                      ...updatedComment._count,
                      replies: (updatedComment._count.replies || 0) + 1
                    }
                  };
                }
                if (updatedComment.replies.length > 0) {
                  return {
                    ...updatedComment,
                    replies: updateComments(updatedComment.replies),
                  };
                }
                return updatedComment;
              });
            }
            return [ensureCommentStructure(newComment), ...comments.map(ensureCommentStructure)];
          };

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => 
              index === 0 ? {
                ...page,
                comments: updateComments(page.comments),
              } : {
                ...page,
                comments: page.comments.map(ensureCommentStructure)
              }
            ),
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Comment created",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  return mutation;
}

export function useDeleteCommentMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.postId];
      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          const removeComment = (comments: CommentData[]): CommentData[] =>
            comments.filter(c => c.id !== deletedComment.id)
              .map(c => ({
                ...c,
                replies: c.replies ? removeComment(c?.replies as CommentData[]) : [],
              })); 

          return {
            ...oldData,
            pages: oldData.pages.map(page => ({
              ...page,
              comments: removeComment(page.comments),
            })),
          };
        },
      );

      toast({
        description: "Comment deleted",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Please try again.",
      });
    },
  });

  return mutation;
}