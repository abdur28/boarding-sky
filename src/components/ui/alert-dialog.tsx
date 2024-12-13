import * as React from "react";
import { cn } from "@/lib/utils";

const AlertDialog = ({ open, onOpenChange, children }: any) => {
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

const AlertDialogContent = React.forwardRef(({ className, ...props }: any, ref: any) => (
  <div
    ref={ref}
    className={cn(
      "bg-white relative rounded-lg max-w-lg w-full mx-4 p-6 shadow-lg",
      className
    )}
    {...props}
  />
));
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({ className, ...props }: any) => (
  <div
    className={cn("flex flex-col gap-2 mb-4", className)}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }: any) => (
  <div
    className={cn("flex justify-end gap-3 mt-6", className)}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = ({ className, ...props }: any) => (
  <h2
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
);
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = ({ className, ...props }: any) => (
  <p
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
);
AlertDialogDescription.displayName = "AlertDialogDescription";

const AlertDialogAction = ({ className, ...props }: any) => (
  <button
    className={cn(
      "inline-flex items-center justify-center px-4 py-2 font-medium",
      "rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      className
    )}
    {...props}
  />
);
AlertDialogAction.displayName = "AlertDialogAction";

const AlertDialogCancel = ({ className, onCancel, ...props }: any) => (
  <button
    onClick={onCancel}
    className={cn(
      "inline-flex items-center justify-center px-4 py-2 font-medium",
      "rounded-md text-sm text-gray-700 bg-white border border-gray-300",
      "hover:bg-gray-50 focus:outline-none focus-visible:ring-2",
      "focus-visible:ring-blue-500",
      className
    )}
    {...props}
  />
);
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
};