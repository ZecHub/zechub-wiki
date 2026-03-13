import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/util";

// ──────────────────────────────────────────────────────────────
// SHADCN/UI CARD PRIMITIVES (used by TreasuryTab and future components)
// ──────────────────────────────────────────────────────────────

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ──────────────────────────────────────────────────────────────
// YOUR ORIGINAL LEGACY CARD (kept exactly as-is for backward compatibility)
// ──────────────────────────────────────────────────────────────

// Card.js
interface CardProps {
  title: string;
  imageUrl: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const LegacyCard: React.FC<CardProps> = ({
  title,
  imageUrl,
  description,
  buttonText,
  buttonLink,
}) => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg md:m-4">
      <Image
        className="w-full"
        src={imageUrl}
        alt="Card image cap"
        width="1000"
        height={1000}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pb-4">
        <Link
          href={buttonLink}
          className="bg-[#1984c7] text-white font-bold py-2 px-4 rounded"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

// Export the legacy card as default (so all your existing pages keep working)
export default LegacyCard;

// Export shadcn primitives as named exports (what TreasuryTab needs)
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
