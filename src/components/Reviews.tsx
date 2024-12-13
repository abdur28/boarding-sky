"use client";
import { CardStack } from "./ui/card-stack";
import { cn } from "@/lib/utils";

export function Reviews({reviews}: {reviews: any[]}) {
  const cards = reviews.map((review, index) => {
    const content = ({content}: {content: string}) => {
      return (
        <p>{content}</p>
      )
    }
    return {
      id: index,
      name: review.name,
      designation: review.role,
      content: content({content: review.review}),
    };
  })
  return (
    <div className="h-[25rem] lg:h-[18rem] flex items-center justify-center w-full">
      <CardStack items={cards} />
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold text-second   px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};
