import { Cpu, Zap, Eye, Lock } from "lucide-react";
import { type ReactiveRule } from "@/framework/reactive/engine";
import { useForm, FormContext, useFieldState, useWatch } from "@/hooks/useFormBuilder";
import Label from "@components/ui/typography/Label/Label";
import Box from "@components/ui/containers/Box/Box";
import Card from "@components/ui/containers/Card/Card";
import Chip from "@components/ui/display/Chip/Chip";
import FormBuilder from "@components/ui/forms/FormBuilder/FormBuilder";
import type { FormConfig } from "@components/ui/forms/FormBuilder/types";
import Button from "@components/ui/inputs/Button/Button";

/**
 * Reactive rules for the shipping form demo.
 * These declaratively define computed fields and conditional UI behavior.
 */
const shippingRules: ReactiveRule[] = [
  {
    id: "total_weight",
    dependencies: ["item_weight", "quantity"],
    compute: (data) => {
      const w = Number(data.item_weight) || 0;
      const q = Number(data.quantity) || 1;
      return (w * q).toFixed(2);
    },
  },
  {
    id: "shipping_cost",
    dependencies: ["total_weight", "shipping_type"],
    compute: (data) => {
      const weight = Number(data.total_weight) || 0;
      const type = data.shipping_type as string;
      const rate = type === "International" ? 12.5 : 5.0;
      return `₹${(weight * rate).toFixed(2)}`;
    },
  },
  {
    id: "show_customs",
    dependencies: ["shipping_type"],
    when: (data) => data.shipping_type === "International",
    then: [{ action: "show", target: "customs_declaration" }],
  },
  {
    id: "disable_express",
    dependencies: ["total_weight"],
    when: (data) => Number(data.total_weight) > 50,
    then: [{ action: "disable", target: "express_notes" }],
  },
];

/**
 * FormConfig: Declarative form layout using our FormBuilder.
 */
const shippingFormConfig: FormConfig = {
  id: "reactive-engine-demo",
  sections: [
    {
      id: "weight-section",
      title: "Package Details",
      description:
        "Enter the item weight and quantity to see computed fields update in real time.",
      columns: 2,
      fields: [
        {
          name: "item_weight",
          label: "Item Weight (kg)",
          type: "number",
          required: true,
        },
        { name: "quantity", label: "Quantity", type: "number", required: true },
      ],
    },
    {
      id: "shipping-section",
      title: "Shipping Configuration",
      description:
        "Select shipping type to trigger conditional visibility rules.",
      columns: 2,
      fields: [
        {
          name: "shipping_type",
          label: "Shipping Type",
          type: "select",
          options: [
            { label: "Domestic", value: "Domestic" },
            { label: "International", value: "International" },
          ],
        },
        {
          name: "express_notes",
          label: "Express Shipping Notes",
          type: "text",
        },
      ],
    },
    {
      id: "customs-section",
      title: "Customs",
      columns: 1,
      fields: [
        {
          name: "customs_declaration",
          label: "Customs Declaration",
          type: "text",
        },
      ],
    },
  ],
};

const defaultValues = {
  item_weight: 2.5,
  quantity: 4,
  shipping_type: "Domestic",
  customs_declaration: "",
  express_notes: "",
};

/**
 * A child component that uses useWatch and useFieldState
 * to reactively render computed outputs.
 */
const ComputedOutputs = () => {
  const totalWeight = useWatch("total_weight");
  const shippingCost = useWatch("shipping_cost");
  const expressState = useFieldState("express_notes");

  return (
    <Box display="grid" gap="md" className="grid-cols-1 md:grid-cols-3">
      <OutputCard label="Total Weight" value={`${totalWeight ?? "0"} kg`} />
      <OutputCard
        label="Shipping Cost"
        value={String(shippingCost ?? "₹0.00")}
      />
      <OutputCard
        label="Express Available"
        value={expressState.disabled ? "No (>50kg)" : "Yes"}
        variant={expressState.disabled ? "destructive" : "success"}
      />
    </Box>
  );
};

/**
 * A child component that uses useFieldState to inspect
 * every field's reactive state for debugging.
 */
const FieldStateInspector = () => {
  const fields = [
    "item_weight",
    "quantity",
    "shipping_type",
    "total_weight",
    "shipping_cost",
    "customs_declaration",
    "express_notes",
  ];

  return (
    <Box
      display="grid"
      gap="sm"
      className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      {fields.map((name) => (
        <FieldStateCard key={name} name={name} />
      ))}
    </Box>
  );
};

const FieldStateCard = ({ name }: { name: string }) => {
  const state = useFieldState(name);

  return (
    <Card
      variant="default"
      padding="sm"
      radius="lg"
      className="border-border/50 bg-muted/30"
    >
      <Box display="flex" direction="column" gap="xs">
        <Label variant="subtitle" className="font-mono text-xs text-primary">
          {name}
        </Label>
        <Box display="flex" gap="xs" className="flex-wrap">
          <Chip variant="default" size="sm" className="font-mono text-[10px]">
            {String(state.value ?? "—")}
          </Chip>
          <Chip
            variant={state.visible ? "default" : "outline"}
            size="sm"
            className="text-[10px]"
          >
            {state.visible ? "visible" : "hidden"}
          </Chip>
          <Chip
            variant={state.disabled ? "outline" : "default"}
            size="sm"
            className="text-[10px]"
          >
            {state.disabled ? "disabled" : "enabled"}
          </Chip>
        </Box>
      </Box>
    </Card>
  );
};

const ReactiveEngineDocs = () => {
  const form = useForm({
    defaultValues,
    rules: shippingRules,
    onSubmit: (data) => {
      console.log("[ReactiveEngine Demo] Submitted:", data);
    },
  });

  return (
    <Box
      display="flex"
      direction="column"
      gap="lg"
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Header */}
      <header>
        <Box display="flex" gap="sm">
          <Box
            display="flex"
            align="center"
            justify="center"
            className="h-18 w-18 shrink-0 rounded-xl bg-primary p-4 shadow-lg shadow-primary/30"
          >
            <Cpu size={40} className="text-primary-foreground" />
          </Box>
          <Box display="flex" direction="column" gap="xs">
            <Label variant="heading">Reactive Engine</Label>
            <Label variant="subheading" className="max-w-2xl">
              A dependency-graph-based runtime that powers dynamic forms. Fields
              react to each other's values — computing, showing/hiding, and
              enabling/disabling automatically.
            </Label>
          </Box>
        </Box>
      </header>

      {/* Concepts */}
      <Box display="grid" gap="md" className="grid-cols-1 md:grid-cols-3">
        <ConceptCard
          icon={<Zap size={20} className="text-primary" />}
          title="Computed Fields"
          desc="Define formulas that auto-calculate when dependencies change. e.g. total_weight = item_weight × quantity."
        />
        <ConceptCard
          icon={<Eye size={20} className="text-primary" />}
          title="Conditional Visibility"
          desc="Show or hide fields based on runtime conditions. e.g. Show customs declaration only for international shipping."
        />
        <ConceptCard
          icon={<Lock size={20} className="text-primary" />}
          title="Enable / Disable"
          desc="Disable fields when conditions are met. e.g. Disable express shipping when package exceeds 50kg."
        />
      </Box>

      {/* Live Demo using FormBuilder + useForm */}
      <Card
        variant="default"
        padding="lg"
        radius="xl"
        className="relative overflow-hidden border-primary/20"
      >
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/5 blur-[60px]" />

        <Box
          display="flex"
          direction="column"
          gap="md"
          className="relative z-10"
        >
          <Box display="flex" direction="column" gap="xs">
            <Label variant="title" className="flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              Live Playground
            </Label>
            <Label variant="subtitle">
              This form is rendered by{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
                FormBuilder
              </code>{" "}
              and powered by{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
                useForm
              </code>{" "}
              +{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
                ReactiveEngine
              </code>
              .
            </Label>
          </Box>

          <div className="h-px w-full bg-border" />

          <FormContext.Provider value={form}>
            {/* The actual FormBuilder-driven form */}
            <FormBuilder
              config={shippingFormConfig}
              form={form}
              rules={shippingRules}
              defaultValues={defaultValues}
            >
              <Button type="submit" variant="default">
                Submit
              </Button>
            </FormBuilder>

            <div className="h-px w-full bg-border" />

            {/* Computed Outputs — uses useWatch inside FormContext */}
            <Label
              variant="subtitle"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Computed Outputs (via useWatch)
            </Label>
            <ComputedOutputs />

            {/* Field State Inspector — uses useFieldState inside FormContext */}
            <Label
              variant="subtitle"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Field State Inspector (via useFieldState)
            </Label>
            <FieldStateInspector />
          </FormContext.Provider>
        </Box>
      </Card>
    </Box>
  );
};

const ConceptCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
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
      className="mb-4 h-10 w-10 rounded-lg bg-primary/10"
    >
      {icon}
    </Box>
    <Box display="flex" direction="column" gap="xs">
      <Label variant="title">{title}</Label>
      <Label variant="subtitle">{desc}</Label>
    </Box>
  </Card>
);

const OutputCard = ({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "success" | "destructive";
}) => (
  <Card
    variant="default"
    padding="md"
    radius="lg"
    className="border-border/50 bg-muted/30"
  >
    <Box display="flex" direction="column" gap="xs">
      <Label variant="subtitle" className="text-xs text-muted-foreground">
        {label}
      </Label>
      <span
        className={`text-lg font-bold tracking-tight ${
          variant === "success"
            ? "text-green-500"
            : variant === "destructive"
              ? "text-destructive"
              : "text-foreground"
        }`}
      >
        {value}
      </span>
    </Box>
  </Card>
);

export default ReactiveEngineDocs;
