import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Activity } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@components/ui/containers/Card/Card";
import Button from "@components/ui/inputs/Button/Button";

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
        pill: "text-muted-foreground",
        underline:
          "rounded-none border-b-2 border-transparent px-1 py-3 text-muted-foreground",
        enclosed:
          "rounded-full border border-transparent text-muted-foreground",
        ghost: "text-muted-foreground",
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
  contentMaxHeight?: string | number;
}

const TabsContext = React.createContext<{
  variant: "pill" | "underline" | "enclosed" | "ghost";
  size: "sm" | "md";
  keepMounted: boolean;
  value?: string;
  delayedValue?: string;
  contentMaxHeight?: string | number;
}>({ variant: "pill", size: "md", keepMounted: false });

const Tabs = ({
  className,
  variant = "pill",
  size = "md",
  items,
  keepMounted = false,
  contentMaxHeight,
  children,
  defaultValue,
  value,
  onValueChange,
  ...props
}: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);
  const [delayedValue, setDelayedValue] = React.useState(value || defaultValue);

  React.useEffect(() => {
    const val = value !== undefined ? value : activeTab;
    const timer = setTimeout(() => {
      setDelayedValue(val);
    }, 400); // Sync with transition duration
    return () => clearTimeout(timer);
  }, [value, activeTab]);

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
        delayedValue: delayedValue!,
        contentMaxHeight,
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

const TabsList = ({
  className,
  ref,
  ...props
}: TabsListProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { variant, value } = React.useContext(TabsContext);
  const [indicatorStyle, setIndicatorStyle] =
    React.useState<React.CSSProperties>({});
  const [scrollInfo, setScrollInfo] = React.useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const innerRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Expose ref
  React.useImperativeHandle(ref, () => innerRef.current!);

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Use a 2px buffer to handle sub-pixel rendering
      setScrollInfo({
        canScrollLeft: scrollLeft > 2,
        canScrollRight:
          scrollWidth > clientWidth + 2 &&
          scrollLeft < scrollWidth - clientWidth - 2,
      });
    }
  }, []);

  React.useLayoutEffect(() => {
    checkScroll();

    if (scrollRef.current) {
      const observer = new ResizeObserver(checkScroll);
      observer.observe(scrollRef.current);
      return () => observer.disconnect();
    }
  }, [checkScroll]);

  React.useLayoutEffect(() => {
    if (!innerRef.current) return;

    const activeTrigger = innerRef.current.querySelector(
      '[data-state="active"]',
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

  const scrollBy = (offset: number) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="group/tabs relative flex w-fit max-w-full items-center">
      {/* Scroll Fades */}
      <div
        className={cn(
          "pointer-events-none absolute left-0 z-20 h-full w-12 transition-opacity duration-300",
          scrollInfo.canScrollLeft
            ? "bg-gradient-to-r from-background opacity-100"
            : "opacity-0",
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute right-0 z-20 h-full w-12 transition-opacity duration-300",
          scrollInfo.canScrollRight
            ? "bg-gradient-to-l from-background opacity-100"
            : "opacity-0",
        )}
      />

      {/* Nav Arrows */}
      <div className="absolute left-1 z-30 flex h-full items-center pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "water-lens h-7 w-7 rounded-full shadow-sm transition-all pointer-events-auto",
            scrollInfo.canScrollLeft
              ? "translate-x-0 opacity-100"
              : "-translate-x-4 opacity-0 scale-50",
          )}
          onClick={() => scrollBy(-150)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute right-1 z-30 flex h-full items-center pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "water-lens h-7 w-7 rounded-full shadow-sm transition-all pointer-events-auto",
            scrollInfo.canScrollRight
              ? "translate-x-0 opacity-100"
              : "translate-x-4 opacity-0 scale-50",
          )}
          onClick={() => scrollBy(150)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={cn(
          "scrollbar-none relative overflow-x-auto",
          tabsListVariants({ variant }),
          className,
        )}
      >
        <TabsPrimitive.List
          ref={innerRef}
          className="relative flex h-full w-full items-center justify-start gap-1"
          {...props}
        >
          <div
            className={cn(
              "absolute top-0 left-0 z-0 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              variant === "pill" && "rounded-lg bg-primary",
              variant === "enclosed" && "rounded-full bg-primary",
              variant === "ghost" && "rounded-lg bg-muted",
              variant === "underline" &&
                "rounded-none border-b-2 border-primary bg-transparent",
            )}
            style={{
              ...indicatorStyle,
              height: variant === "underline" ? "100%" : indicatorStyle.height,
            }}
          />
          {props.children}
        </TabsPrimitive.List>
      </div>
    </div>
  );
};

TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> {
  icon?: React.ReactNode;
}

const TabsTrigger = ({
  className,
  icon,
  value,
  children,
  ref,
  ...props
}: TabsTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const {
    variant,
    size,
    value: actualValue,
    delayedValue,
  } = React.useContext(TabsContext);
  // Color only when both the instant and delayed values match
  // This ensures the old tab mutes instantly, and the new tab waits for the indicator
  const isActuallyActive = actualValue === value && delayedValue === value;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      className={cn(
        tabsTriggerVariants({ variant, size }),
        isActuallyActive
          ? [
              (variant === "pill" || variant === "enclosed") &&
                "text-primary-foreground",
              (variant === "underline" || variant === "ghost") &&
                "text-foreground",
            ]
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </TabsPrimitive.Trigger>
  );
};
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
> {}

const TabsContent = ({
  className,
  value,
  children,
  ref,
  ...props
}: TabsContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const {
    keepMounted,
    value: activeValue,
    contentMaxHeight,
  } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  const content = (
    <Card
      className={cn(
        "mt-4 outline-none transition-all duration-300 ease-out-expo data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 data-[state=active]:animate-tab-in",
        contentMaxHeight && "custom-scrollbar overflow-y-auto",
        className,
      )}
      style={contentMaxHeight ? { maxHeight: contentMaxHeight } : undefined}
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
};
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
