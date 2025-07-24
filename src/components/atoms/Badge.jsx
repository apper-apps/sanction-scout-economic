import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "sm",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-sm font-medium transition-colors";
  
  const variants = {
    default: "bg-surface text-gray-300 border border-gray-700",
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-gray-200",
    success: "bg-success text-white",
    warning: "bg-warning text-gray-900",
    error: "bg-error text-white",
    info: "bg-info text-white"
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm"
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = "Badge";

export default Badge;