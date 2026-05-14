import {
  Home,
  MessageSquare,
  PlusSquare,
  BarChart3,
  LayoutGrid,
  Archive,
  Heart,
  Folder,
  Search,
  Settings,
  User,
  Sparkles,
  Plus,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Info,
  Palette,
  Layers,
  Square,
  Shield,
} from "lucide-react";

const ThemePalette = () => {
  return (
    <div className="min-h-screen space-y-16 p-10 font-sans transition-colors duration-500">
      {/* SECTION 1: CORE THEME SHOWCASE */}
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="flex flex-col space-y-2 border-b border-border pb-6">
          <h1 className="flex items-center text-3xl font-bold text-foreground">
            <Palette className="mr-3 h-8 w-8 text-primary" />
            Design System: Core Tokens
          </h1>
          <p className="text-muted-foreground">
            Visualization of brand colors, semantic tokens, shadows, and
            geometry.
          </p>
        </header>

        {/* Brand Palette */}
        <section className="space-y-6">
          <h2 className="flex items-center text-xl font-bold text-foreground">
            <LayoutGrid className="mr-2 h-5 w-5 text-primary" />
            Brand & Surface
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <SwatchGroup
              label="Primary"
              color="bg-primary"
              onColor="bg-primary/20"
              hex="var(--primary)"
              onHex="var(--primary)/20"
              textColor="text-primary-foreground"
              onTextColor="text-primary"
            />
            <SwatchGroup
              label="Secondary"
              color="bg-secondary"
              onColor="bg-secondary/20"
              hex="var(--secondary)"
              onHex="var(--secondary)/20"
              textColor="text-secondary-foreground"
              onTextColor="text-secondary"
            />
            <SwatchGroup
              label="Surface"
              color="bg-card"
              onColor="bg-muted"
              hex="var(--card)"
              onHex="var(--muted)"
              textColor="text-foreground"
              onTextColor="text-muted-foreground"
            />
            <SwatchGroup
              label="Muted"
              color="bg-muted"
              onColor="bg-muted/50"
              hex="var(--muted)"
              onHex="var(--muted)/50"
              textColor="text-foreground"
              onTextColor="text-muted-foreground"
            />
          </div>
        </section>

        {/* Semantic Palette */}
        <section className="space-y-6">
          <h2 className="flex items-center text-xl font-bold text-foreground">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Semantic Colors
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <SwatchGroup
              label="Success"
              color="bg-success"
              onColor="bg-success/10"
              hex="var(--success)"
              onHex="var(--success)/10"
              textColor="text-success-foreground"
              onTextColor="text-success"
              icon={<CheckCircle size={14} />}
            />
            <SwatchGroup
              label="Error"
              color="bg-destructive"
              onColor="bg-destructive/10"
              hex="var(--destructive)"
              onHex="var(--destructive)/10"
              textColor="text-destructive-foreground"
              onTextColor="text-destructive"
              icon={<ShieldAlert size={14} />}
            />
            <SwatchGroup
              label="Warning"
              color="bg-warning"
              onColor="bg-warning/10"
              hex="var(--warning)"
              onHex="var(--warning)/10"
              textColor="text-warning-foreground"
              onTextColor="text-warning"
              icon={<AlertTriangle size={14} />}
            />
            <SwatchGroup
              label="Info"
              color="bg-primary"
              onColor="bg-primary/10"
              hex="var(--primary)"
              onHex="var(--primary)/10"
              textColor="text-primary-foreground"
              onTextColor="text-primary"
              icon={<Info size={14} />}
            />
          </div>
        </section>

        {/* Shadows & Radius */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <section className="space-y-6">
            <h2 className="flex items-center text-xl font-bold text-foreground">
              <Layers className="mr-2 h-5 w-5 text-primary" />
              Elevation & Shadows
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ShadowBox label="Small" shadow="shadow-sm" />
              <ShadowBox label="Medium" shadow="shadow-md" />
              <ShadowBox label="Large" shadow="shadow-lg" />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="flex items-center text-xl font-bold text-foreground">
              <Square className="mr-2 h-5 w-5 text-primary" />
              Border Radius
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <RadiusBox label="sm" radius="rounded-sm" />
              <RadiusBox label="md" radius="rounded-md" />
              <RadiusBox label="lg" radius="rounded-lg" />
              <RadiusBox label="xl" radius="rounded-xl" />
            </div>
          </section>
        </div>
      </div>

      {/* SECTION 2: HIGH-FIDELITY LAYOUT EXAMPLE */}
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            Application Layout Example
          </h2>
          <p className="text-sm text-muted-foreground">
            A demonstration of how the tokens combine into a high-fidelity
            interface.
          </p>
        </header>

        <div className="flex h-[700px] w-full overflow-hidden rounded-[40px] border border-border/50 bg-card/40 shadow-2xl backdrop-blur-xl">
          {/* Slim Sidebar */}
          <div className="flex w-16 flex-col items-center space-y-8 border-r border-border py-8">
            <div className="rounded-full bg-primary p-3 shadow-lg shadow-primary/20">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <nav className="flex flex-1 flex-col space-y-6">
              <SidebarIcon icon={<Home className="h-5 w-5" />} />
              <SidebarIcon icon={<MessageSquare className="h-5 w-5" />} />
              <SidebarIcon icon={<PlusSquare className="h-5 w-5" />} />
              <SidebarIcon icon={<BarChart3 className="h-5 w-5" />} />
              <SidebarIcon icon={<LayoutGrid className="h-5 w-5" />} active />
            </nav>
            <div className="space-y-6">
              <SidebarIcon icon={<User className="h-5 w-5" />} />
              <SidebarIcon icon={<Settings className="h-5 w-5" />} />
            </div>
          </div>

          {/* Main Menu Sidebar */}
          <div className="flex w-64 flex-col space-y-8 border-r border-border bg-card/50 p-6 backdrop-blur-md">
            <header className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Menu
              </span>
            </header>
            <nav className="flex-1 space-y-1">
              <MenuItem icon={<Home size={18} />} label="Home" />
              <MenuItem
                icon={<MessageSquare size={18} />}
                label="Messages"
                badge={2}
              />
              <MenuItem
                icon={<PlusSquare size={18} />}
                label="Integrations"
                hasMore
              />
              <MenuItem icon={<BarChart3 size={18} />} label="Finance" />
              <div className="space-y-1 pt-4">
                <MenuItem
                  icon={<LayoutGrid size={18} />}
                  label="Threads"
                  active
                />
                <div className="ml-6 mt-1 space-y-1 border-l border-border pl-4">
                  <SubMenuItem label="Fignuts" />
                  <SubMenuItem label="Enlarz System" active />
                  <SubMenuItem label="Hugeicons" />
                </div>
              </div>
              <div className="space-y-1 pt-4">
                <MenuItem icon={<Archive size={18} />} label="Storage" />
                <MenuItem icon={<Search size={18} />} label="Explore" hasMore />
              </div>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-background/50 p-10">
            <div className="max-w-md space-y-8">
              <section className="space-y-4">
                <div className="px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Quick Access
                </div>
                <div className="space-y-3">
                  <FolderItem
                    icon={<Archive size={18} />}
                    label="Archive"
                    count={12}
                  />
                  <FolderItem icon={<Heart size={18} />} label="Favourite's" />
                  <FolderItem icon={<Folder size={18} />} label="Stroke LLC" />
                  <FolderItem
                    icon={<Folder size={18} />}
                    label="Duotone"
                    active
                  />
                </div>
              </section>
              <section className="group relative overflow-hidden rounded-3xl bg-primary p-6 shadow-xl shadow-primary/20">
                <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                  <Sparkles size={100} />
                </div>
                <h4 className="relative z-10 text-lg font-bold text-primary-foreground">
                  Brand Identity
                </h4>
                <p className="relative z-10 mt-1 text-xs text-primary-foreground/70">
                  Lime Green (#bef264) as the core accent for the Buopso
                  Framework.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-components for Showcase --- */

interface SwatchGroupProps {
  label: string;
  color: string;
  onColor: string;
  hex: string;
  onHex: string;
  textColor: string;
  onTextColor: string;
  icon?: React.ReactNode;
}

const SwatchGroup = ({
  label,
  color,
  onColor,
  hex,
  onHex,
  textColor,
  onTextColor,
  icon,
}: SwatchGroupProps) => (
  <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
    <div className="space-y-2">
      <div
        className={`h-16 ${color} flex flex-col justify-between rounded-lg p-3`}
      >
        <div className={textColor}>{icon}</div>
        <span className={`${textColor} text-[10px] font-bold`}>{label}</span>
      </div>
      <div className="pl-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {hex}
      </div>
    </div>
    <div className="space-y-2">
      <div className={`h-12 ${onColor} flex items-center rounded-lg px-3`}>
        <span className={`${onTextColor} text-[10px] font-bold`}>
          On {label}
        </span>
      </div>
      <div className="pl-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {onHex}
      </div>
    </div>
  </div>
);

interface ShadowBoxProps {
  label: string;
  shadow: string;
}

const ShadowBox = ({ label, shadow }: ShadowBoxProps) => (
  <div
    className={`flex h-24 flex-col items-center justify-center space-y-1 rounded-lg border bg-card ${shadow}`}
  >
    <span className="text-xs font-bold text-foreground">{label}</span>
    <span className="text-[9px] uppercase tracking-tighter text-muted-foreground">
      {shadow}
    </span>
  </div>
);

interface RadiusBoxProps {
  label: string;
  radius: string;
}

const RadiusBox = ({ label, radius }: RadiusBoxProps) => (
  <div className="space-y-2">
    <div
      className={`h-16 w-full border border-primary/20 bg-primary/10 ${radius}`}
    ></div>
    <span className="block text-center text-[10px] font-bold uppercase text-muted-foreground">
      {label}
    </span>
  </div>
);

/* --- Layout Example Components --- */

interface SidebarIconProps {
  icon: React.ReactNode;
  active?: boolean;
}

const SidebarIcon = ({ icon, active }: SidebarIconProps) => (
  <div
    className={`cursor-pointer rounded-2xl p-2.5 transition-all duration-300 ${active ? "border bg-card text-foreground shadow-lg" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
  >
    {icon}
  </div>
);

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  hasMore?: boolean;
  active?: boolean;
}

const MenuItem = ({ icon, label, badge, hasMore, active }: MenuItemProps) => (
  <div
    className={`group flex cursor-pointer items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${active ? "bg-foreground text-background shadow-xl" : "text-muted-foreground hover:bg-muted"}`}
  >
    <div className="flex items-center space-x-3">
      <span
        className={
          active
            ? "text-background"
            : "text-muted-foreground group-hover:text-foreground"
        }
      >
        {icon}
      </span>
      <span className="text-sm font-semibold tracking-tight">{label}</span>
    </div>
    {badge && (
      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
        {badge}
      </span>
    )}
    {hasMore && <Plus size={14} className="text-muted-foreground" />}
  </div>
);

interface SubMenuItemProps {
  label: string;
  active?: boolean;
}

const SubMenuItem = ({ label, active }: SubMenuItemProps) => (
  <div
    className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${active ? "border bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
  >
    {label}
  </div>
);

interface FolderItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  count?: number;
}

const FolderItem = ({ icon, label, active, count }: FolderItemProps) => (
  <div
    className={`flex cursor-pointer items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${active ? "border bg-card text-foreground shadow-lg" : "text-muted-foreground hover:bg-muted"}`}
  >
    <div className="flex items-center space-x-4">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? "bg-primary/10 text-primary" : "bg-transparent text-muted-foreground"}`}
      >
        {icon}
      </div>
      <span className="text-sm font-semibold tracking-tight">{label}</span>
    </div>
    {count && (
      <span className="text-[10px] font-bold text-muted-foreground/70">
        {count} items
      </span>
    )}
  </div>
);

export default ThemePalette;
