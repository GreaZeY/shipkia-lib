/* eslint-disable react-refresh/only-export-components */

import { FolderKanban, Settings, Share2, Plus } from "lucide-react";
import Box from "@components/ui/containers/Box/Box";
import Button from "@components/ui/inputs/Button/Button";
import { register } from "@framework/registry";

/**
 * CustomProjectHeader - An override for the 'Project' doctype header.
 * Demonstrates the 'list:header:[doctype]' override pattern.
 */
const CustomProjectHeader = ({ doctype }: { doctype: string }) => {
  return (
    <Box display="flex" align="center" justify="between" className="border-b border-primary/10 pb-4">
      <Box display="flex" align="center" gap="md">
        <Box className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          <FolderKanban size={24} />
        </Box>
        <Box>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Project Portfolio
          </h1>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            {doctype} Management
          </p>
        </Box>
      </Box>

      <Box display="flex" align="center" gap="sm">
        <Button variant="ghost" size="sm" startIcon={<Share2 size={16} />}>
          Share
        </Button>
        <Button variant="ghost" size="sm" startIcon={<Settings size={16} />}>
          View Settings
        </Button>
        <Button variant="primary" size="lg" className="rounded-2xl shadow-lg shadow-primary/20" startIcon={<Plus size={18} />}>
          New Project
        </Button>
      </Box>
    </Box>
  );
};

/**
 * Mock registration script.
 * In a real app, this would be part of the app's 'overrides' config.
 */
export const registerProjectOverrides = () => {
  register("list:header:Project", CustomProjectHeader);
};
