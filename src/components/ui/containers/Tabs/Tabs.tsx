import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Activity } from "react";
import Card from "../Card/Card";

const tabsVariants = cva("w-full", {
  variants: {
    variant: {
      pill: "",
      underline: "",
      enclosed: "",
      ghost: "",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
  },
  defaultVariants: {
    variant: "enclosed",
    size: "md",
  },
});

const tabsListVariants = cva(
  "water-lens inline-flex items-center justify-start gap-1 p-1 transition-all",
  {
    variants: {
      variant: {
        pill: "rounded-xl bg-muted/50",
        underline:
          "border-b border-border gap-6 px-0 rounded-none bg-transparent",
        enclosed: "rounded-full bg-muted/30 border-x border border-border",
        ghost: "bg-transparent gap-2 px-0",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  },
);

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10",
  {
    variants: {
      variant: {
        pill: "data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground",
        underline:
          "rounded-none border-b-2 border-transparent px-1 py-3 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground",
        enclosed:
          "rounded-full border border-transparent data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground",
        ghost:
          "data-[state=active]:text-foreground text-muted-foreground hover:text-foreground",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "pill",
      size: "md",
    },
  },
);

export type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  component?: React.ReactNode;
  disabled?: boolean;
};

export interface TabsProps
  extends
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsVariants> {
  items?: TabItem[];
  keepMounted?: boolean;
}

const TabsContext = React.createContext<{
  variant: "pill" | "underline" | "enclosed" | "ghost";
  size: "sm" | "md";
  keepMounted: boolean;
  value?: string;
}>({ variant: "pill", size: "md", keepMounted: false });

const Tabs = ({
  className,
  variant = "pill",
  size = "md",
  items,
  keepMounted = false,
  children,
  defaultValue,
  value,
  onValueChange,
  ...props
}: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);

  const handleValueChange = (val: string) => {
    setActiveTab(val);
    onValueChange?.(val);
  };

  const actualValue = value !== undefined ? value : activeTab;

  return (
    <TabsContext.Provider
      value={{
        variant: variant!,
        size: size!,
        keepMounted,
        value: actualValue,
      }}
    >
      <TabsPrimitive.Root
        value={actualValue}
        onValueChange={handleValueChange}
        className={cn(tabsVariants({ variant, size }), className)}
        {...props}
      >
        {items ? (
          <>
            <TabsList>
              {items.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  icon={item.icon}
                  disabled={item.disabled}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {items.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                {item.component}
              </TabsContent>
            ))}
          </>
        ) : (
          children
        )}
      </TabsPrimitive.Root>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => {
  const { variant, value } = React.useContext(TabsContext);
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({});
  const innerRef = React.useRef<HTMLDivElement>(null);

  // Combine refs
  React.useImperativeHandle(ref, () => innerRef.current!);

  React.useLayoutEffect(() => {
    if (!innerRef.current) return;

    // Find the active trigger element
    const activeTrigger = innerRef.current.querySelector(
      '[data-state="active"]'
    ) as HTMLElement;

    if (activeTrigger) {
      const listRect = innerRef.current.getBoundingClientRect();
      const triggerRect = activeTrigger.getBoundingClientRect();

      setIndicatorStyle({
        transform: `translateX(${triggerRect.left - listRect.left}px) translateY(${triggerRect.top - listRect.top}px)`,
        width: triggerRect.width,
        height: triggerRect.height,
        opacity: 1,
      });
    } else {
      setIndicatorStyle({ opacity: 0 });
    }
  }, [value]);

  return (
    <div className="relative">
      <TabsPrimitive.List
        ref={innerRef}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      >
        {/* Liquid Indicator */}
        <div
          className={cn(
            "absolute top-0 left-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none z-0",
            variant === "pill" && "rounded-lg bg-primary",
            variant === "enclosed" && "rounded-full bg-primary",
            variant === "ghost" && "rounded-lg bg-muted",
            variant === "underline" &&
              "border-b-2 border-primary bg-transparent rounded-none",
          )}
          style={{
            ...indicatorStyle,
            // Height adjustment for underline variant to only show border
            height: variant === "underline" ? "100%" : indicatorStyle.height,
          }}
        />
        {props.children}
      </TabsPrimitive.List>
    </div>
  );
});
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> {
  icon?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, icon, children, ...props }, ref) => {
  const { variant, size } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant, size }), className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
> {}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, value, children, ...props }, ref) => {
  const { keepMounted, value: activeValue } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  const content = (
    <Card
      className={cn(
        "mt-4 outline-none transition-all duration-300 ease-out-expo data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 data-[state=active]:animate-tab-in",
        className,
      )}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </Card>
  );

  if (keepMounted) {
    return (
      <Activity mode={isActive ? "visible" : "hidden"}>
        <TabsPrimitive.Content ref={ref} value={value} forceMount {...props}>
          {content}
        </TabsPrimitive.Content>
      </Activity>
    );
  }

  return (
    <TabsPrimitive.Content ref={ref} value={value} {...props}>
      {content}
    </TabsPrimitive.Content>
  );
});
TabsContent.displayName = "TabsContent";

// Export compound components
const TabsComponent = Tabs as typeof Tabs & {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
};

TabsComponent.List = TabsList;
TabsComponent.Trigger = TabsTrigger;
TabsComponent.Content = TabsContent;

export default TabsComponent;
export { TabsList, TabsTrigger, TabsContent };
