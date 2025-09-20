import React from "react";
import { cn } from "@/lib/utils";

const SidebarProvider = ({ children, defaultOpen = true, open, onOpenChange }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(defaultOpen);

  React.useEffect(() => {
    if (open !== undefined) {
      setSidebarOpen(open);
    }
  }, [open]);

  const handleToggle = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    onOpenChange?.(newState);
  };

  return (
    <div className="flex min-h-screen">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            sidebarOpen,
            onToggle: handleToggle
          });
        }
        return child;
      })}
    </div>
  );
};

const Sidebar = React.forwardRef(({ className, sidebarOpen = true, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col w-64 bg-background border-r transition-all duration-200",
      !sidebarOpen && "w-16",
      "hidden md:flex",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 border-b", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 overflow-auto py-4", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-t", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = ({ children }) => (
  <div className="mb-6">{children}</div>
);

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-4 py-2 text-sm font-medium text-muted-foreground", className)}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = ({ children }) => (
  <div className="space-y-1">{children}</div>
);

const SidebarMenu = ({ children }) => (
  <nav className="space-y-1">{children}</nav>
);

const SidebarMenuItem = ({ children }) => (
  <div>{children}</div>
);

const SidebarMenuButton = React.forwardRef(({ className, asChild, children, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(children, {
      ref,
      className: cn(
        "flex items-center w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      ),
      ...props
    });
  }

  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarTrigger = ({ className, ...props }) => (
  <button
    className={cn("p-2 rounded-md hover:bg-accent", className)}
    {...props}
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>
);

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger
};