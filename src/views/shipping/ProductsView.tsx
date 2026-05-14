import { useState } from "react";
import Box from "@components/ui/containers/Box/Box";
import Card from "@components/ui/containers/Card/Card";
import Button from "@components/ui/inputs/Button/Button";
import Input from "@components/ui/inputs/Input/Input";
import VirtualizedGrid from "@components/ui/display/Grid/VirtualizedGrid";
import Chip from "@components/ui/display/Chip/Chip";
import BulkActionBar from "@components/display/BulkActionBar";
import { Search, Filter, Plus, FileDown, Package } from "lucide-react";

// Mock Data for Products
const productColumns = [
  { id: "sku", label: "SKU", type: "text" as const, width: 120 },
  { id: "name", label: "Product Name", type: "text" as const, flex: 1 },
  { id: "weight", label: "Weight (kg)", type: "text" as const, width: 120, align: "right" as const },
  { id: "dimensions", label: "Dimensions (cm)", type: "text" as const, width: 150, align: "center" as const },
  { 
    id: "stock", 
    label: "Stock Status", 
    type: "custom" as const, 
    width: 150,
    renderCell: (value: number) => {
      let variant: "success" | "secondary" | "error" = "success";
      let label = "In Stock";
      
      if (value === 0) {
        variant = "error";
        label = "Out of Stock";
      } else if (value < 20) {
        variant = "secondary";
        label = "Low Stock";
      }
      
      return (
        <Box display="flex" align="center" gap="sm">
          <Chip variant={variant} className="text-[10px]">{label}</Chip>
          <span className="text-xs font-medium">{value} units</span>
        </Box>
      );
    }
  },
  { id: "price", label: "Unit Price", type: "text" as const, width: 120, align: "right" as const },
];

const generateMockProducts = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `PROD-${i}`, // Internal ID
    sku: `SKU-${10000 + i}`,
    name: `Premium Product ${i + 1}`,
    weight: (Math.random() * 5 + 0.5).toFixed(2),
    dimensions: `${Math.floor(Math.random() * 20 + 10)}x${Math.floor(Math.random() * 20 + 10)}x${Math.floor(Math.random() * 20 + 10)}`,
    stock: Math.floor(Math.random() * 100),
    price: `$${(Math.random() * 100 + 10).toFixed(2)}`,
  }));
};

const mockProducts = generateMockProducts(120);

const ProductsView = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  return (
    <Box className="w-full h-full p-8 overflow-hidden animate-in fade-in duration-500" display="flex" direction="column" gap="lg">
      {/* Header Area */}
      <Box display="flex" justify="between" align="center" className="shrink-0">
        <Box display="flex" direction="column" gap="xs">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog, weight, and dimensions for shipping calculation.</p>
        </Box>
        <Box display="flex" gap="md">
          <Button variant="outline" startIcon={<FileDown size={16} />}>Export Catalog</Button>
          <Button variant="primary" startIcon={<Plus size={16} />}>Add Product</Button>
        </Box>
      </Box>

      {/* Toolbar */}
      <Card className="shrink-0 p-2 border-border/40 shadow-sm flex items-center justify-between">
        <Box display="flex" gap="sm" className="w-1/3 min-w-[300px]">
          <Input 
            startIcon={<Search />} 
            placeholder="Search by SKU, Product Name..." 
            className="border-transparent bg-muted/50 focus:bg-background"
          />
        </Box>
        <Box display="flex" gap="sm" className="pr-2">
          <Button variant="ghost" size="sm" startIcon={<Package size={16} />}>Sync Inventory</Button>
          <Button variant="ghost" size="sm" startIcon={<Filter size={16} />}>Filters</Button>
        </Box>
      </Card>

      {/* Grid Area */}
      <Card className="flex-1 overflow-hidden border-border/40 shadow-sm flex flex-col">
        <VirtualizedGrid 
          columns={productColumns} 
          data={mockProducts} 
          selectable={true}
          onSelectionChange={(ids) => setSelectedIds(ids)}
          className="flex-1 border-none rounded-none" 
        />
      </Card>

      {/* Bulk Action Bar */}
      <BulkActionBar 
        selectedCount={selectedIds.length} 
        onClear={() => setSelectedIds([])} 
        doctype="Product" 
      />
    </Box>
  );
};

export default ProductsView;
