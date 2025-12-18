import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";   
import { cn } from "../../lib/utils.js"

/* -------------------- Avatar -------------------- */

const Avatar = React.forwardRef(function Avatar(
  { className, ...props },
  ref
) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
});

Avatar.displayName = "Avatar";

/* -------------------- Avatar Image -------------------- */

const AvatarImage = React.forwardRef(function AvatarImage(
  { className, ...props },
  ref
) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  );
});

AvatarImage.displayName = "AvatarImage";

/* -------------------- Avatar Fallback -------------------- */

const AvatarFallback = React.forwardRef(function AvatarFallback(
  { className, ...props },
  ref
) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  );
});

AvatarFallback.displayName = "AvatarFallback";

/* -------------------- EXPORTS -------------------- */

export { Avatar, AvatarImage, AvatarFallback };
