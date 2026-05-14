import React from "react";
import { Trash, Edit, UserPlus, Tag, X } from "lucide-react";
import Button from "../ui/inputs/Button/Button";
import Box from "../ui/containers/Box/Box";
import Card from "../ui/containers/Card/Card";

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  doctype: string;
}

/**
 * BulkActionBar - A floating bar that appears when records are selected.
 * (Frappe Pattern #4)
 */
const BulkActionBar: React.FC<BulkActionBarProps> = ({ 
  selectedCount, 
  onClear,
  doctype 
}) => {
  if (selectedCount === 0) return null;

  return (
    <Box className="fixed bottom-8 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card className="flex items-center justify-between gap-4 border-primary/20 bg-background/95 p-3 shadow-2xl backdrop-blur-md">
        <Box display="flex" align="center" gap="md" className="pl-2">
          <Box className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {selectedCount}
          </Box>
          <span className="text-sm font-medium">
            {selectedCount === 1 ? doctype : `${doctype} records`} selected
          </span>
        </Box>

        <Box display="flex" align="center" gap="sm">
          <Button variant="ghost" size="sm" startIcon={<Edit size={14} />}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" startIcon={<UserPlus size={14} />}>
            Assign
          </Button>
          <Button variant="ghost" size="sm" startIcon={<Tag size={14} />}>
            Tags
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" startIcon={<Trash size={14} />}>
            Delete
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={onClear}
          >
            <X size={16} />
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default BulkActionBar;
