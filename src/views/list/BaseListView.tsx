import React, { useState, useMemo } from "react";
import { Plus, Search, Filter, MoreVertical, Download, Upload } from "lucide-react";
import EditableGrid from "@/components/ui/display/Grid/EditableGrid";
import type { GridColumn } from "@/components/ui/display/Grid/types";
import Button from "@/components/ui/inputs/Button/Button";
import Input, { type InputChangeData } from "@/components/ui/inputs/Input/Input";
import Box from "@/components/ui/containers/Box/Box";
import Container from "@/components/ui/containers/Container/Container";
import { resolve } from "@/framework/registry";
import BulkActionBar from "@/components/display/BulkActionBar";
import { useNavigate } from "react-router-dom";
import { useListRuntime } from "@/hooks/useListRuntime";
import type { ReactiveValues } from "@/framework/reactive/engine";

interface BaseListViewProps {
  doctype: string;
}

/**
 * BaseListView - The default template for List Views.
 */
const BaseListView: React.FC<BaseListViewProps> = ({ doctype }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  
  // 1. Resolve custom sub-components (Frappe patterns)
  const ListHeader = resolve(`list:header:${doctype}`, DefaultListHeader);
  const ListActions = resolve(`list:actions:${doctype}`, DefaultListActions);
  
  // Mock data/columns for now - in production this comes from a hook
  const columns = useMemo<GridColumn[]>(() => [
    { id: "name", label: "ID", width: 150 },
    { id: "status", label: "Status", type: "select", options: [
      { value: "Open", label: "Open" },
      { value: "Closed", label: "Closed" }
    ]},
    { id: "owner", label: "Owner" },
    { id: "modified", label: "Last Modified" }
  ], []);

  const [mockData] = useState([
    { id: "1", name: "DOC-001", status: "Open", owner: "Nikhil", modified: "2024-05-05" },
    { id: "2", name: "DOC-002", status: "Closed", owner: "Admin", modified: "2024-05-04" }
  ]);

  // Section 24: Reactive Business Logic
  const rules = useMemo(() => [
    {
      id: "status",
      dependencies: ["owner"],
      compute: (data: ReactiveValues) => data.owner === "Admin" ? "Closed" : "Open"
    }
  ], []);

  const runtime = useListRuntime({
    doctype,
    initialData: mockData,
    rules
  });

  return (
    <Container fluid className="flex h-full flex-col gap-4 p-6 relative">
      {/* 1. Header Section */}
      <ListHeader doctype={doctype} />

      {/* 2. View Controls Section */}
      <Box display="flex" align="center" justify="between" className="gap-4">
        <Box display="flex" align="center" gap="sm" className="flex-1 max-w-md">
          <Input 
            placeholder={`Search ${doctype}...`}
            startIcon={<Search size={16} />}
            value={searchQuery}
            onChange={(val: InputChangeData) => setSearchQuery(val.value)}
          />
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
        </Box>
        <ListActions doctype={doctype} />
      </Box>

      {/* 3. Main Data Section */}
      <Box className="flex-1 min-h-0 rounded-xl border bg-card/50 overflow-hidden shadow-sm">
        <EditableGrid 
          columns={columns}
          data={runtime.data}
          rules={runtime.rules}
          onCellChange={runtime.handleCellChange}
          onColumnResize={(id, width) => runtime.saveColumnConfig(id, { width })}
          selectable
          onSelectionChange={(indices) => setSelectedRows(indices)}
          onRowClick={(row) => navigate(`/${doctype}/${row.name}`)}
        />
      </Box>

      {/* 4. Bulk Action Bar */}
      <BulkActionBar 
        selectedCount={selectedRows.length} 
        doctype={doctype} 
        onClear={() => setSelectedRows([])}
      />
    </Container>
  );
};

// --- Sub-components (can be overridden) ---

const DefaultListHeader = ({ doctype }: { doctype: string }) => (
  <Box display="flex" align="center" justify="between">
    <h1 className="text-2xl font-bold tracking-tight capitalize">
      {doctype} List
    </h1>
    <Button variant="primary" startIcon={<Plus size={18} />}>
      New
    </Button>
  </Box>
);

const DefaultListActions: React.FC<{ doctype: string }> = () => (
  <Box display="flex" align="center" gap="sm">
    <Button variant="ghost" size="icon">
      <Download size={16} />
    </Button>
    <Button variant="ghost" size="icon">
      <Upload size={16} />
    </Button>
    <Button variant="ghost" size="icon">
      <MoreVertical size={16} />
    </Button>
  </Box>
);

export default BaseListView;
