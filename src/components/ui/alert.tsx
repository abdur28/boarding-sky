import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning:
          "border-warning/50 text-warning dark:border-warning [&>svg]:text-warning",
        success:
          "border-success/50 text-success dark:border-success [&>svg]:text-success",
        info:
          "border-info/50 text-info dark:border-info [&>svg]:text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

const AlertIcon = ({
  variant
}: {
  variant?: VariantProps<typeof alertVariants>["variant"]
}) => {
  const icons = {
    default: Info,
    destructive: XCircle,
    warning: AlertTriangle,
    success: AlertCircle,
    info: Info,
  }

  const Icon = variant && icons[variant] ? icons[variant] : icons.default
  return <Icon className="h-4 w-4" />
}

const AlertRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      icon?: boolean
    }
>(({ className, variant, icon = true, children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  >
    {icon && <AlertIcon variant={variant} />}
    {children}
  </div>
))
AlertRoot.displayName = "AlertRoot"

export { Alert, AlertTitle, AlertDescription, AlertRoot }