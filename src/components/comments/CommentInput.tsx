import { PostData } from "@/lib/types";
import { SendHorizonal } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSubmitCommentMutation } from "./mutations";
import Loading from "@/app/(main)/loading";

interface CommentInputProps {
  post: PostData;
  parentId?: string;
  onSubmit?: () => void; // Add this line
}

export default function CommentInput({ post, parentId, onSubmit }: CommentInputProps) {
  const [input, setInput] = useState("");

  const mutation = useSubmitCommentMutation(post?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input) return;

    mutation.mutate(
      {
        post,
        content: input,
        parentId,
      },
      {
        onSuccess: () => setInput(""),
      },
    );

    // Call onSubmit after successful submission
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form className="flex w-full items-center gap-2" onSubmit={handleSubmit}>
      <Input
        placeholder="Write a comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Improved styles
        aria-label="Comment input" // Accessibility improvement
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
        className="transition-transform duration-200 hover:scale-105" // Added hover effect
        aria-label="Submit comment" // Accessibility improvement
      >
        {!mutation.isPending ? (
          <SendHorizonal />
        ) : (
          <div className="flex items-center justify-center mx-auto h-auto">
            <Loading />
          </div>
        )}
      </Button>
    </form>
  );
}
