import React from "react";
import { cn } from "@/lib/utils";

const DropdownMenu = ({ children, open, onOpenChange }) => {
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
        if (child.type === DropdownMenuTrigger) {
          return React.cloneElement(child, {
            onClick: handleToggle,
            open: isOpen
          });
        }
        if (child.type === DropdownMenuContent) {
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

const DropdownMenuTrigger = ({ asChild, children, onClick, ...props }) => {
  if (asChild) {
    return React.cloneElement(children, { ...props, onClick });
  }
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const DropdownMenuContent = React.forwardRef(({ className, align = "center", sideOffset = 4, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
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
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(({ className, children, onClick, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };