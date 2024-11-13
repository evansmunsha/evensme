"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { CommentData, PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Comments from "../comments/Comments";
import Linkify from "../Linkify";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import PostMoreButton from "./PostMoreButton";

interface PostProps {
  post: PostData;
  comment: CommentData;
}

export default function Post({ post,comment }: PostProps) {
  const { user } = useSession();

  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_LENGTH = 200; // Set your desired maximum length here

  return (
    <article className="group/post space-y-3 bg-card py-0.5 px-0.5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post?.user}>
            <Link href={`/users/${post?.user?.username}`}>
              <UserAvatar avatarUrl={post?.user?.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post?.user}>
              <Link
                href={`/users/${post?.user?.username}`}
                className="block font-medium hover:underline"
              >
                {post?.user?.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post?.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post?.createdAt)}
            </Link>
          </div>
        </div>
        {post?.user?.id === user?.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <Link
          href={`/posts/${post?.id}`}
        >
          {isExpanded || post.content.length <= MAX_LENGTH
            ? post.content
            : `${post.content.substring(0, MAX_LENGTH)}...`}
        </Link>
        {!isExpanded && post.content.length > MAX_LENGTH && (
          <button 
            className="text-blue-300 hover:underline"
            onClick={() => setIsExpanded(true)}
          >
            Read more
          </button>
        )}
      </Linkify>
      {!!post?.attachments.length ? (
        <Link href={`/posts/${post.id}`}>

          <MediaPreviews attachments={post?.attachments} />
        </Link>
      ) : (
        <p className="text-muted-foreground">No media attached</p>
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post?.id}
            initialState={{
              likes: post?._count?.likes,
              isLikedByUser: post?.likes?.some((like) => like?.userId === user?.id),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
            aria-label="Toggle comments"
          />
        </div>
        <BookmarkButton
          postId={post?.id}
          initialState={{
            isBookmarkedByUser: post?.bookmarks?.some(
              (bookmark) => bookmark?.userId === user?.id,
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} comment={comment} />}

      
    </article>
  );
}

interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const handlePlay = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Play the video if it is in view
          if (videoRef.current) {
            videoRef.current.play();
          }
        } else {
          // Pause the video if it is out of view
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Reset to the beginning
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handlePlay, {
      threshold: 0.5, // Adjust this value as needed
    });

    const currentVideo = videoRef.current; // Copy the ref value to a variable

    if (currentVideo) {
      observerRef.current.observe(currentVideo);
    }

    // Cleanup function
    return () => {
      if (currentVideo && observerRef.current) {
        observerRef.current.unobserve(currentVideo);
      }
    };
  }, []); // Add dependencies as needed

  if (media.type === "IMAGE") {
    return (
      <div className="relative">
        <Image
          src={media.url}
          alt="Attachment"
          width={1000}
          height={500}
          className="max-h-[30rem] rounded-xl transition-transform z-10"
        />
      </div>
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div className="relative">
        
        <video
          ref={videoRef}
          src={media.url}
          controls
          className="w-[100%] max-h-[20.9rem] rounded-xl transition-transform z-10"
          aria-label="Video attachment"
          onLoadStart={handleLoad}
          onError={handleError}
        />
        {hasError && <p className="text-destructive">Failed to load video.</p>}
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 hover:bg-gray-200 transition-colors" aria-label="View comments">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post?._count?.comments}{" "}
        <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
