import React from "react";
import { cn } from "@/lib/utils";

const Popover = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === PopoverTrigger) {
          return React.cloneElement(child, {
            onClick: handleToggle,
            open: isOpen
          });
        }
        if (child.type === PopoverContent) {
          return isOpen ? React.cloneElement(child, {
            onClose: () => {
              setIsOpen(false);
              onOpenChange?.(false);
            }
          }) : null;
        }
        return child;
      })}
    </div>
  );
};

const PopoverTrigger = ({ asChild, children, onClick, ...props }) => {
  if (asChild) {
    return React.cloneElement(children, { ...props, onClick });
  }
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      "top-full mt-1",
      align === "start" && "left-0",
      align === "center" && "left-1/2 transform -translate-x-1/2",
      align === "end" && "right-0",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };