import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData, PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import CommentMoreButton from "./CommentMoreButton";
import { useState } from "react";
import CommentInput from "./CommentInput"; // Make sure to import CommentInput
import Modal from "./Modal";  // Assume we have a Modal component

import LikeButton from "../posts/LikeButton";

interface CommentProps {
  comment: CommentData;
  depth?: number;
  post: PostData; // Change this to accept the full PostData
}

export default function Comment({ comment, depth = 0, post }: CommentProps) {
  const { user } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasReplies = comment.replies && comment.replies.length > 0;

  const MAX_LENGTH = 150; // Set a maximum length for the comment

  return (
    <div className={`group/comment flex gap-3 px-2 py-3 ${depth > 0 ? 'ml-0' : ''}`}>
      <span className="sm:inline flex-shrink-0"> {/* Prevent shrinking */}
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarUrl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div className="flex-1 w-fit"> {/* Allow the comment to take available space */}
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-medium hover:underline"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>

        <div className="bg-red-600 text-white px-2 py-1 rounded-lg shadow-md">
          {isExpanded || comment.content.length <= MAX_LENGTH
            ? comment.content
            : `${comment.content.substring(0, MAX_LENGTH)}...`}
          {!isExpanded && comment.content.length > MAX_LENGTH && (
            <button 
              className="text-blue-300 hover:underline"
              onClick={() => setIsExpanded(true)}
            >
              Read more
            </button>
          )}
        </div>
        <div className="mt-2 flex gap-4">
          <div className="flex items-center gap-5">
            <LikeButton
              postId={comment?.id}
              initialState={{
                likes: comment?._count?.likes,
                isLikedByUser: comment?.likes?.some((like) => like?.userId === user?.id),
              }}
            />
            
          </div>
          <button 
            className="text-sm text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" // Improved focus styles
            onClick={() => setIsReplying(!isReplying)}
            aria-label="Reply to comment"
          >
            Reply
          </button>
          {hasReplies && (
            <button 
              className="text-sm text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" // Improved focus styles
              onClick={() => setIsModalOpen(true)}
              aria-label={`Show ${comment.replies.length} replies`}
            >
               {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
        {isReplying && (
          <div className="mt-2">
            <CommentInput post={post} parentId={comment.id} onSubmit={() => setIsReplying(false)} />
          </div>
        )}
        {hasReplies && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="max-h-[80vh] overflow-y-auto">
              {comment.replies.map(reply => (
                <Comment key={reply.id} comment={reply as CommentData} depth={0} post={post} />
              ))}
            </div>
          </Modal>
        )}
      </div>
      {comment.user.id === user.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
