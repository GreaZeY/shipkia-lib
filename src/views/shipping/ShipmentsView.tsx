import { useState } from "react";
import Box from "@components/ui/containers/Box/Box";
import Card from "@components/ui/containers/Card/Card";
import Button from "@components/ui/inputs/Button/Button";
import Input from "@components/ui/inputs/Input/Input";
import VirtualizedGrid from "@components/ui/display/Grid/VirtualizedGrid";
import Chip from "@components/ui/display/Chip/Chip";
import BulkActionBar from "@components/display/BulkActionBar";
import { Search, Filter, Truck, FileDown } from "lucide-react";

// Mock Data for Shipments
const shipmentColumns = [
  { id: "awb", label: "AWB Number", type: "text" as const, width: 160 },
  { id: "orderId", label: "Order ID", type: "text" as const, width: 120 },
  { id: "courier", label: "Courier", type: "text" as const, width: 150 },
  { id: "destination", label: "Destination", type: "text" as const, flex: 1 },
  { 
    id: "status", 
    label: "Status", 
    type: "custom" as const, 
    width: 160,
    renderCell: (value: any) => {
      let variant: "success" | "secondary" | "primary" | "error" = "secondary";
      if (value === "Delivered") variant = "success";
      if (value === "In Transit") variant = "primary";
      if (value === "Out for Delivery") variant = "secondary";
      if (value === "Exception") variant = "error";
      
      return <Chip variant={variant} className="text-[10px]">{value}</Chip>;
    }
  },
  { id: "eta", label: "ETA", type: "text" as const, width: 120 },
];

const generateMockShipments = (count: number) => {
  const statuses = ["In Transit", "Out for Delivery", "Delivered", "Exception"];
  const couriers = ["FedEx", "UPS", "DHL", "BlueDart", "Delhivery"];
  const cities = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Miami, FL"];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `SHP-${i}`, // Internal ID for grid selection
    awb: `AWB${Math.floor(100000000 + Math.random() * 900000000)}`,
    orderId: `ORD-${1000 + Math.floor(Math.random() * 500)}`,
    courier: couriers[Math.floor(Math.random() * couriers.length)],
    destination: cities[Math.floor(Math.random() * cities.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    eta: new Date(Date.now() + Math.random() * 500000000).toLocaleDateString(),
  }));
};

const mockShipments = generateMockShipments(150);

const ShipmentsView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  return (
    <Box className="w-full h-full p-8 overflow-hidden animate-in fade-in duration-500" display="flex" direction="column" gap="lg">
      {/* Header Area */}
      <Box display="flex" justify="between" align="center" className="shrink-0">
        <Box display="flex" direction="column" gap="xs">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Shipments</h1>
          <p className="text-sm text-muted-foreground">Track active shipments and resolve exceptions.</p>
        </Box>
        <Box display="flex" gap="md">
          <Button variant="outline" startIcon={<FileDown size={16} />}>Export Report</Button>
          <Button variant="primary" startIcon={<Truck size={16} />}>Track AWB</Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Card className="shrink-0 p-2 border-border/40 shadow-sm flex items-center justify-between">
        <Box display="flex" gap="sm" className="w-1/3 min-w-[300px]">
          <Input 
            startIcon={<Search />} 
            placeholder="Search AWB, Order ID..." 
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
          columns={shipmentColumns} 
          data={mockShipments} 
          selectable={true}
          onSelectionChange={(ids) => setSelectedIds(ids)}
          className="flex-1 border-none rounded-none" 
        />
      </Card>

      {/* Bulk Action Bar */}
      <BulkActionBar 
        selectedCount={selectedIds.length} 
        onClear={() => setSelectedIds([])} 
        doctype="Shipment" 
      />
    </Box>
  );
};

export default ShipmentsView;
