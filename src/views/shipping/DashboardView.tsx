import React from "react";
import Box from "@components/ui/containers/Box/Box";
import Card from "@components/ui/containers/Card/Card";
import Button from "@components/ui/inputs/Button/Button";
import Grid from "@components/ui/display/Grid/Grid";
import { 
  TrendingUp, 
  Package, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Truck
} from "lucide-react";

// Mock Data for Recent Orders
const recentOrdersColumns = [
  { id: "id", label: "Order ID", type: "text" as const, width: 100 },
  { id: "customer", label: "Customer", type: "text" as const, flex: 1 },
  { id: "status", label: "Status", type: "text" as const, width: 120 },
  { id: "total", label: "Total", type: "text" as const, width: 100, align: "right" as const },
];

const recentOrdersData = [
  { id: "ORD-991", customer: "Acme Corp", status: "Processing", total: "$1,250.00" },
  { id: "ORD-992", customer: "Globex Inc", status: "Shipped", total: "$840.00" },
  { id: "ORD-993", customer: "Soylent Corp", status: "Delivered", total: "$3,200.00" },
  { id: "ORD-994", customer: "Initech", status: "Pending", total: "$150.00" },
  { id: "ORD-995", customer: "Umbrella Corp", status: "Processing", total: "$4,500.00" },
];

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, trend, isPositive, icon }: MetricCardProps) => (
  <Card className="flex flex-col gap-4 p-6 border-border/40 hover:border-primary/30 transition-colors shadow-sm relative overflow-hidden group">
    {/* Subtle gradient glow effect on hover */}
    <div className="absolute -inset-px bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
    
    <Box display="flex" align="center" justify="between" className="relative z-10">
      <span className="text-sm font-semibold text-muted-foreground">{title}</span>
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
    </Box>
    <Box display="flex" direction="column" gap="xs" className="relative z-10">
      <h3 className="text-3xl font-bold tracking-tight text-foreground">{value}</h3>
      <Box display="flex" align="center" gap="xs">
        <span className={`flex items-center text-xs font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {trend}
        </span>
        <span className="text-xs text-muted-foreground">vs last month</span>
      </Box>
    </Box>
  </Card>
);

const DashboardView = () => {
  return (
    <Box className="w-full h-full p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-500 gap-8" display="flex" direction="column">
      {/* Header Area */}
      <Box display="flex" justify="between" align="center">
        <Box display="flex" direction="column" gap="xs">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your shipping performance and recent activity.</p>
        </Box>
        <Box display="flex" gap="md">
          <Button variant="outline" startIcon={<Clock size={16} />}>Last 30 Days</Button>
          <Button variant="primary" startIcon={<Package size={16} />}>Create Order</Button>
        </Box>
      </Box>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value="$45,231.89" 
          trend="+20.1%" 
          isPositive={true} 
          icon={<TrendingUp size={20} />} 
        />
        <MetricCard 
          title="Active Shipments" 
          value="2,350" 
          trend="+15.2%" 
          isPositive={true} 
          icon={<Truck size={20} />} 
        />
        <MetricCard 
          title="Pending Orders" 
          value="432" 
          trend="-4.5%" 
          isPositive={false} 
          icon={<Package size={20} />} 
        />
        <MetricCard 
          title="Delivery Success" 
          value="98.5%" 
          trend="+1.2%" 
          isPositive={true} 
          icon={<CheckCircle size={20} />} 
        />
      </div>

      {/* Main Content Area - Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - Chart Placeholder */}
        <Card className="xl:col-span-2 p-6 flex flex-col gap-6 border-border/40 shadow-sm">
          <Box display="flex" justify="between" align="center">
            <h3 className="text-lg font-bold">Shipment Volume</h3>
            <Button variant="ghost" size="sm">View Report</Button>
          </Box>
          <div className="flex-1 min-h-[300px] w-full bg-muted/20 rounded-lg border border-dashed border-border/50 flex items-center justify-center relative overflow-hidden">
             {/* A stylized placeholder for a chart */}
             <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-primary/10 to-transparent" />
             <svg className="absolute w-full h-full opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
               <path d="M0,100 L0,50 Q25,70 50,40 T100,20 L100,100 Z" fill="hsl(var(--primary)/0.1)" />
               <path d="M0,50 Q25,70 50,40 T100,20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
             </svg>
             <span className="text-sm font-medium text-muted-foreground relative z-10 bg-card px-4 py-1.5 rounded-full shadow-sm border border-border/50">
               Interactive Chart Rendered Here
             </span>
          </div>
        </Card>

        {/* Right Column - Recent Orders */}
        <Card className="p-6 flex flex-col gap-6 border-border/40 shadow-sm">
          <Box display="flex" justify="between" align="center">
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </Box>
          <div className="flex-1 -mx-6">
            {/* Reusing Grid with transparent background */}
            <Grid 
              columns={recentOrdersColumns} 
              data={recentOrdersData} 
              className="h-full border-none !bg-transparent" 
            />
          </div>
        </Card>

      </div>
    </Box>
  );
};

export default DashboardView;
