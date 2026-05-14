import React from "react";
import { ArrowLeft, Save, Trash, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FormBuilder from "@components/ui/forms/FormBuilder/FormBuilder";
import Button from "@components/ui/inputs/Button/Button";
import Box from "@components/ui/containers/Box/Box";
import Container from "@components/ui/containers/Container/Container";
import Card from "@components/ui/containers/Card/Card";
import { resolve } from "@framework/registry";

interface BaseFormViewProps {
  doctype: string;
  name?: string;
}

/**
 * BaseFormView - The default template for Form/Detail Views.
 */
const BaseFormView: React.FC<BaseFormViewProps> = ({ doctype, name }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = React.useState(false);
  const [status, setStatus] = React.useState("Open");
  
  // Resolve custom components
  const FormHeader = resolve(`form:header:${doctype}`, DefaultFormHeader);
  
  // Form Config
  const formConfig = React.useMemo(() => ({
    id: `form-${doctype}`,
    sections: [
      {
        id: "main",
        columns: 2,
        fields: [
          { name: "name", label: "ID", type: "text" as const, required: true },
          { name: "status", label: "Status", type: "select" as const, options: [
            { label: "Open", value: "Open" },
            { label: "Closed", value: "Closed" }
          ]},
          { name: "owner", label: "Owner", type: "text" as const },
          { name: "description", label: "Description", type: "textarea" as const, colSpan: 2 }
        ]
      }
    ]
  }), [doctype]);

  const handleSave = async (values: Record<string, unknown>) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setStatus(typeof values.status === "string" ? values.status : status);
    console.log("Mock Save:", values);
  };

  return (
    <Container fluid className="flex h-full flex-col gap-6 p-6">
      {/* 1. Form Header */}
      <FormHeader 
        doctype={doctype} 
        name={name} 
        status={status}
        isSaving={isSaving}
        onBack={() => navigate(`/${doctype}`)} 
        onSave={() => (document.querySelector('form') as HTMLFormElement)?.requestSubmit()}
      />

      {/* 2. Main Form Card */}
      <Box className="flex-1 min-h-0 overflow-y-auto">
        <Card className="mx-auto max-w-4xl p-8 shadow-xl border-primary/5">
          <FormBuilder 
            config={formConfig}
            defaultValues={{ name, status, owner: "Nikhil" }}
            onSubmit={handleSave}
          />
        </Card>
      </Box>
    </Container>
  );
};

// --- Sub-components ---

interface DefaultFormHeaderProps {
  doctype: string;
  name?: string;
  status: string;
  isSaving: boolean;
  onBack: () => void;
  onSave: () => void;
}

const DefaultFormHeader = ({
  doctype,
  name,
  status,
  isSaving,
  onBack,
  onSave,
}: DefaultFormHeaderProps) => (
  <Box display="flex" align="center" justify="between">
    <Box display="flex" align="center" gap="sm">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft size={20} />
      </Button>
      <Box>
        <Box display="flex" align="center" gap="xs">
          <h1 className="text-xl font-bold tracking-tight">
            {name || `New ${doctype}`}
          </h1>
          <div className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${status === 'Open' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'}`}>
            {status}
          </div>
        </Box>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-70">
          {doctype}
        </p>
      </Box>
    </Box>
    <Box display="flex" align="center" gap="sm">
      <Button variant="ghost" className="text-destructive hover:bg-destructive/10" startIcon={<Trash size={16} />}>
        Delete
      </Button>
      <Button 
        variant="primary" 
        onClick={onSave}
        loading={isSaving}
        startIcon={!isSaving && <Save size={16} />}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
      <Button variant="ghost" size="icon">
        <MoreVertical size={18} />
      </Button>
    </Box>
  </Box>
);

export default BaseFormView;
