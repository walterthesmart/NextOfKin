import React from "react"

const TooltipProvider = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

const Tooltip = ({ children, ...props }) => {
  return <div className="relative" {...props}>{children}</div>
}

const TooltipTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(children, { ref, ...props })
  }
  return <div ref={ref} {...props}>{children}</div>
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md ${className || ""}`}
    {...props}
  />
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
