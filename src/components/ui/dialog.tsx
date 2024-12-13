import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;

  return (
    <div>
      <div 
        className="fixed inset-0 bg-black/30 z-50 transition-opacity"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {children}
      </div>
    </div>
  );
};

const DialogContent = React.forwardRef(({ className, onClose, ...props }: any, ref: any) => (
  <div
    ref={ref}
    className={cn(
      "bg-white relative rounded-lg max-w-lg w-full  max-h-[90vh] mx-4 p-6 shadow-lg overflow-y-scroll",
      "animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  >
    {props.children}
    <button
      className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
      onClick={() => onClose?.()}
    >
      <X className="h-4 w-4" />
    </button>
  </div>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }: any) => (
  <div
    className={cn("flex flex-col gap-2 mb-4", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: any) => (
  <div
    className={cn("flex justify-end gap-3 mt-6", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({ className, ...props }: any) => (
  <h2
    className={cn("text-lg font-semibold leading-none", className)}
    {...props}
  />
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = ({ className, ...props }: any) => (
  <p
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
);
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
};