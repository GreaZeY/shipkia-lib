import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "@/hooks/useAppState";
import { app } from "@/framework/boot";
import { useState, useEffect } from "react";
import Accordion, {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/containers/Accordion/Accordion";
import {
  TextCursorInput,
  Layers,
  BookOpen,
  Type,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Package,
  Truck,
  AlertTriangle,
  Users,
  DollarSign,
  Settings,
} from "lucide-react";
import metadata from "@/lib/docs/metadata.json";
import { cn } from "@/lib/utils";

// Map of icon name strings to lucide components for app-contributed sidebar items
const iconMap: Record<string, React.ReactNode> = {
  package: <Package size={16} />,
  truck: <Truck size={16} />,
  "alert-triangle": <AlertTriangle size={16} />,
  users: <Users size={16} />,
  "dollar-sign": <DollarSign size={16} />,
  settings: <Settings size={16} />,
  layers: <Layers size={16} />,
  "layout-grid": <LayoutGrid size={16} />,
};

const resolveIcon = (icon: string | React.ReactNode): React.ReactNode => {
  if (typeof icon === "string") {
    return iconMap[icon] || <Layers size={16} />;
  }
  return icon;
};

const Sidebar = () => {
  const [appState, setAppState] = useAppState();
  const isExpanded = appState.isSidebarExpanded;
  const setIsExpanded = (val: boolean) =>
    setAppState({ isSidebarExpanded: val });
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = import.meta.env.DEV
    ? [
        {
          label: "Introduction",
          icon: <BookOpen size={16} />,
          path: "/docs/intro",
        },
        {
          label: "Theme",
          icon: <Layers size={16} />,
          path: "/docs/theme-palette",
        },
        {
          type: "seperator",
        },
      ]
    : [];

  const allComponentMeta = Object.values(metadata);

  const categories: Record<string, { label: string; path: string }[]> = {};
  allComponentMeta.forEach((c) => {
    const component = c as { path: string; name: string };
    const parts = component.path.split("/");
    const categoryRaw = parts.length > 4 ? parts[4] : "components";
    const categoryLabel =
      categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);

    if (!categories[categoryLabel]) {
      categories[categoryLabel] = [];
    }
    categories[categoryLabel].push({
      label: component.name,
      path: `/docs/${component.name.toLowerCase()}`,
    });
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "inputs":
        return <TextCursorInput size={16} />;
      case "typography":
        return <Type size={16} />;
      case "containers":
        return <LayoutGrid size={16} />;
      default:
        return <Layers size={16} />;
    }
  };

  const componentItems = import.meta.env.DEV
    ? Object.keys(categories).map((cat) => ({
        label: cat,
        icon: getCategoryIcon(cat),
        path: `#${cat.toLowerCase()}`,
        children: categories[cat],
      }))
    : [];

  const [dynamicSidebarItems, setDynamicSidebarItems] = useState(app.sidebarItems);

  useEffect(() => {
    return app.subscribeSidebar((items) => {
      setDynamicSidebarItems(items);
    });
  }, []);

  // Map dynamic sidebar items into rendering structure
  const appSection = dynamicSidebarItems.map((item) => ({
    label: item.label,
    icon: resolveIcon(item.icon),
    path: item.route,
    children: item.children?.map((child) => ({
      label: child.label,
      path: child.route,
    })),
  }));

  const isDocsRoute = location.pathname.startsWith("/docs");

  const items = isDocsRoute
    ? [...navItems, ...componentItems]
    : [...appSection];

  return (
    <aside className="py-3">
      <div
        className={cn(
          "water-lens border-gray/10 relative flex h-full shrink-0 flex-col items-start border p-2 duration-500 ease-in-out dark:border-white/10",
          isExpanded
            ? "w-sidebar-expanded rounded-[24px]"
            : "w-sidebar-collapsed rounded-[40px]",
        )}
      >
        {/* Logo Section - Centered when collapsed */}
        <div
          className={cn(
            "mb-8 flex w-full shrink-0",
            isExpanded ? "justify-start" : "justify-center",
          )}
        >
          <div className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-xl transition-transform hover:rotate-6">
            <div className="h-5 w-5 rounded-full border-[3px] border-primary"></div>
          </div>
        </div>

        <div
          className={cn(
            "flex w-full flex-1 flex-col space-y-2 overflow-y-auto overflow-x-hidden",
            isExpanded
              ? "custom-scrollbar pr-1"
              : "items-center pr-0 [&::-webkit-scrollbar]:hidden",
          )}
        >
          <Accordion
            type="multiple"
            className="w-full space-y-1"
            value={appState.activeSidebarAccordion}
            onValueChange={(val) =>
              setAppState({ activeSidebarAccordion: val })
            }
          >
            {items.map((item, index) => {
              if ("type" in item && item.type === "seperator") {
                return (
                  <div
                    key={`sep-${index}`}
                    className="mx-auto my-4 h-px w-full shrink-0 bg-border"
                  ></div>
                );
              }

              const typedItem = item as {
                label: string;
                icon: React.ReactNode;
                path?: string;
                children?: Array<{ label: string; path: string }>;
              };

              if (typedItem.children) {
                const isChildActive = typedItem.children.some(
                  (child) => location.pathname === child.path,
                );
                const isParentExactlyActive =
                  location.pathname === typedItem.path;

                return (
                  <AccordionItem
                    value={typedItem.label}
                    key={typedItem.label}
                    className="border-none"
                  >
                    <AccordionTrigger
                      onClick={() => {
                        if (typedItem.path) {
                          navigate(typedItem.path);
                        }
                      }}
                      className={cn(
                        "group flex h-[31px] shrink-0 items-center overflow-hidden rounded-full border-none px-0 py-0 outline-none transition-all duration-300 hover:no-underline",
                        isExpanded ? "w-full pr-4" : "w-full",
                        !isExpanded && "[&>svg]:hidden",
                        isParentExactlyActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:text-primary-foreground"
                          : isChildActive
                            ? "bg-transparent text-primary hover:bg-muted"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <div className="flex w-10 shrink-0 items-center justify-center">
                        {typedItem.icon}
                      </div>
                      <span
                        className={cn(
                          "flex-1 whitespace-nowrap text-left text-body-medium font-bold tracking-tight transition-all duration-500",
                          isExpanded
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-4 opacity-0",
                        )}
                      >
                        {typedItem.label}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="border-none pb-0 pt-1">
                      {isExpanded && (
                        <div className="ml-[20px] flex flex-col space-y-1 overflow-hidden border-l border-border pl-4 transition-all duration-500">
                          {typedItem.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className="group relative w-full"
                            >
                              {({ isActive }) => (
                                <div
                                  className={cn(
                                    "flex shrink-0 items-center overflow-hidden rounded-full py-1.5 transition-all duration-300",
                                    isActive
                                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                                  )}
                                >
                                  <span className="ml-4 whitespace-nowrap text-body-medium font-bold tracking-tight">
                                    {child.label}
                                  </span>
                                </div>
                              )}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return (
                <NavLink
                  to={typedItem.path!}
                  className="group relative mb-1 block w-full"
                  key={typedItem.path || `nav-${index}`}
                >
                  {({ isActive }) => (
                    <div
                      className={cn(
                        "flex h-[30px] shrink-0 items-center overflow-hidden rounded-full transition-all duration-300",
                        isExpanded ? "w-full" : "w-full",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <div className="flex w-10 shrink-0 items-center justify-center">
                        {typedItem.icon}
                      </div>
                      <span
                        className={cn(
                          "whitespace-nowrap text-body-medium font-bold tracking-tight transition-all duration-500",
                          isExpanded
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-4 opacity-0",
                        )}
                      >
                        {typedItem.label}
                      </span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </Accordion>
        </div>

        {/* Toggle Button - Perfectly anchored */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-12 z-[110] flex h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-md transition-transform hover:scale-110 hover:text-foreground"
        >
          {isExpanded ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
