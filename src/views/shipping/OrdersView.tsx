import { useState } from "react";
import Box from "@components/ui/containers/Box/Box";
import Card from "@components/ui/containers/Card/Card";
import Button from "@components/ui/inputs/Button/Button";
import Input from "@components/ui/inputs/Input/Input";
import VirtualizedGrid from "@components/ui/display/Grid/VirtualizedGrid";
import Chip from "@components/ui/display/Chip/Chip";
import BulkActionBar from "@components/display/BulkActionBar";
import { Search, Filter, Plus, FileDown } from "lucide-react";

// Mock Data for Orders
const orderColumns = [
  { id: "id", label: "Order ID", type: "text" as const, width: 120 },
  { id: "date", label: "Date", type: "text" as const, width: 150 },
  { id: "customer", label: "Customer", type: "text" as const, flex: 1 },
  { id: "destination", label: "Destination", type: "text" as const, flex: 1 },
  { 
    id: "status", 
    label: "Status", 
    type: "custom" as const, 
    width: 150,
    renderCell: (value: any) => {
      let variant: "success" | "secondary" | "primary" | "error" = "secondary";
      if (value === "Delivered") variant = "success";
      if (value === "Pending") variant = "secondary";
      if (value === "Processing") variant = "primary";
      if (value === "Cancelled") variant = "error";
      
      return <Chip variant={variant} className="text-[10px]">{value}</Chip>;
    }
  },
  { id: "total", label: "Total", type: "text" as const, width: 120, align: "right" as const },
];

const generateMockOrders = (count: number) => {
  const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const cities = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Miami, FL"];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `ORD-${1000 + i}`,
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
    customer: `Customer ${i + 1}`,
    destination: cities[Math.floor(Math.random() * cities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    total: `$${(Math.random() * 500 + 50).toFixed(2)}`,
  }));
};

const mockOrders = generateMockOrders(250);

const OrdersView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  return (
    <Box className="w-full h-full p-8 overflow-hidden animate-in fade-in duration-500" display="flex" direction="column" gap="lg">
      {/* Header Area */}
      <Box display="flex" justify="between" align="center" className="shrink-0">
        <Box display="flex" direction="column" gap="xs">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and track your customer orders.</p>
        </Box>
        <Box display="flex" gap="md">
          <Button variant="outline" startIcon={<FileDown size={16} />}>Export</Button>
          <Button variant="primary" startIcon={<Plus size={16} />}>Create Order</Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Card className="shrink-0 p-2 border-border/40 shadow-sm flex items-center justify-between">
        <Box display="flex" gap="sm" className="w-1/3 min-w-[300px]">
          <Input 
            startIcon={<Search />} 
            placeholder="Search by Order ID, Customer..." 
            className="border-transparent bg-muted/50 focus:bg-background"
          />
        </Box>
        <Box display="flex" gap="sm" className="pr-2">
          <Button variant="ghost" size="sm" startIcon={<Filter size={16} />}>Filters</Button>
        </Box>
      </Card>

      {/* Grid Area */}
      <Card className="flex-1 overflow-hidden border-border/40 shadow-sm flex flex-col">
        <VirtualizedGrid 
          columns={orderColumns} 
          data={mockOrders} 
          selectable={true}
          onSelectionChange={(ids) => setSelectedIds(ids)}
          className="flex-1 border-none rounded-none" 
        />
      </Card>

      {/* Bulk Action Bar */}
      <BulkActionBar 
        selectedCount={selectedIds.length} 
        onClear={() => setSelectedIds([])} 
        doctype="Order" 
      />
    </Box>
  );
};

export default OrdersView;
