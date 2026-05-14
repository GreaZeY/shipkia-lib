import { Sparkles, Package, Zap, ShieldCheck } from "lucide-react";
import Label from "@components/ui/typography/Label/Label";
import Box from "@components/ui/containers/Box/Box";
import Card from "@components/ui/containers/Card/Card";

const IntroDocs = () => {
  return (
    <Box
      direction="column"
      gap="lg"
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <header>
        <Box direction="column" gap="sm">
          <Box
            display="flex"
            align="center"
            justify="center"
            className="h-12 w-12 rounded-xl bg-primary shadow-lg shadow-primary/30"
          >
            <Sparkles size={24} className="text-primary-foreground" />
          </Box>
          <Box direction="column" gap="xs">
            <Label variant="title">System Design</Label>
            <Label variant="subtitle" className="max-w-2xl">
              A high-performance design system built for the next generation of
              logistics and commerce applications.
            </Label>
          </Box>
        </Box>
      </header>

      <Box display="grid" gap="md" className="grid-cols-1 md:grid-cols-3">
        <FeatureCard
          icon={<Zap size={20} className="text-primary" />}
          title="Atomic Fast"
          desc="Built on top of Radix UI and Tailwind CSS for maximum performance and smallest bundle size."
        />
        <FeatureCard
          icon={<ShieldCheck size={20} className="text-primary" />}
          title="Type Safe"
          desc="Fully written in TypeScript with strict prop validation and comprehensive documentation."
        />
        <FeatureCard
          icon={<Package size={20} className="text-primary" />}
          title="Modular"
          desc="Every component is self-contained and highly customizable through our semantic token system."
        />
      </Box>

      <Card
        variant="default"
        padding="lg"
        radius="xl"
        className="group relative overflow-hidden border-none bg-gray-900 shadow-2xl dark:bg-black"
      >
        <Box direction="column" gap="sm" className="relative z-10">
          <Label variant="title">Ready to build?</Label>
          <Label variant="subtitle" className="max-w-md">
            Explore our component library using the sidebar and start building
            premium experiences today.
          </Label>
        </Box>
        <div className="absolute right-0 top-0 h-48 w-48 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-[80px]"></div>
      </Card>
    </Box>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => (
  <Card
    variant="default"
    padding="md"
    radius="lg"
    interactive
    className="border-border/50 bg-card/50"
  >
    <Box
      display="flex"
      align="center"
      justify="center"
      className="mb-4 h-10 w-10 rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110"
    >
      {icon}
    </Box>
    <Box direction="column" gap="xs">
      <Label variant="title">{title}</Label>
      <Label variant="subtitle">{desc}</Label>
    </Box>
  </Card>
);

export default IntroDocs;
