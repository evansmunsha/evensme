import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";
//import Loading from "@/app/(main)/loading";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && 
      <div className="flex items-center justify-center mx-auto h-auto">
        Loading...
      </div>}
      {props.children}
    </Button>
  );
}
