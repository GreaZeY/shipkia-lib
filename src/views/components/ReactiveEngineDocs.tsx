import { Cpu, Zap, Eye, Lock, Plus } from "lucide-react";
import type { FieldLogic } from "@/framework/reactive/types";
import {
  useForm,
  FormContext,
  useFieldState,
  useWatch,
} from "@/hooks/useFormBuilder";
import Label from "@components/ui/typography/Label/Label";
import Box from "@components/ui/containers/Box/Box";
import Card from "@components/ui/containers/Card/Card";
import Chip from "@components/ui/display/Chip/Chip";
import FormBuilder from "@components/ui/forms/FormBuilder/FormBuilder";
import type { FormConfig } from "@components/ui/forms/FormBuilder/types";
import Button from "@components/ui/inputs/Button/Button";

/**
 * Server-driven logic rules — matches the backend JSON structure exactly.
 * No JS functions needed. The engine resolves operators from its registry.
 */
const shippingLogics: FieldLogic[] = [
  // RULE 1: When shipping_type updates and equals "International" → show customs_declaration
  {
    id: "show_customs",
    active: true,
    conditions: [
      {
        id: "c1",
        field: "shipping_type",
        opr: "eq",
        values: "International",
        pos: 1,
      },
    ],
    actions: [
      {
        id: "a1",
        resourceType: "field",
        opr: "show",
        fields: ["customs_declaration"],
      },
    ],
  },
  // RULE 2: When shipping_type is NOT "International" → hide customs_declaration
  {
    id: "hide_customs",
    active: true,
    conditions: [
      {
        id: "c2",
        field: "shipping_type",
        opr: "neq",
        values: "International",
        pos: 1,
      },
    ],
    actions: [
      {
        id: "a2",
        resourceType: "field",
        opr: "hide",
        fields: ["customs_declaration"],
      },
    ],
  },
  // RULE 3: When total_weight > 50 → disable express_notes
  {
    id: "disable_express",
    active: true,
    conditions: [
      {
        id: "c3",
        field: "total_weight",
        opr: "gt",
        values: 50,
        pos: 1,
      },
    ],
    actions: [
      {
        id: "a3",
        resourceType: "field",
        opr: "disable",
        fields: ["express_notes"],
      },
    ],
  },
  // RULE 4: When total_weight <= 50 → enable express_notes
  {
    id: "enable_express",
    active: true,
    conditions: [
      {
        id: "c4",
        field: "total_weight",
        opr: "lte",
        values: 50,
        pos: 1,
      },
    ],
    actions: [
      {
        id: "a4",
        resourceType: "field",
        opr: "enable",
        fields: ["express_notes"],
      },
    ],
  },
  // RULE 5: When item_weight OR quantity updates → compute total_weight
  {
    id: "compute_weight",
    active: true,
    conditions: [
      {
        id: "c5a",
        field: "item_weight",
        opr: "update",
        values: "",
        pos: 1,
      },
      {
        id: "c5b",
        field: "quantity",
        opr: "update",
        values: "",
        connector: "or",
        pos: 2,
      },
    ],
    actions: [
      {
        id: "a5",
        resourceType: "field",
        opr: "set",
        valueType: "fx",
        value: "{{id_item_weight}} * {{id_quantity}}",
        fields: ["total_weight"],
      },
    ],
  },
];

/**
 * FormConfig — declarative form layout.
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
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
        },
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
  total_weight: 10,
};

/**
 * Computed outputs — uses useWatch inside FormContext.
 */
const ComputedOutputs = () => {
  const totalWeight = useWatch("total_weight");
  const expressState = useFieldState("express_notes");

  return (
    <Box display="grid" gap="md" className="grid-cols-1 md:grid-cols-3">
      <OutputCard label="Total Weight" value={`${totalWeight ?? "0"} kg`} />
      <OutputCard
        label="Express Available"
        value={expressState.disabled ? "No (>50kg)" : "Yes"}
        variant={expressState.disabled ? "destructive" : "success"}
      />
      <OutputCard
        label="Customs Required"
        value={
          useFieldState("customs_declaration").visible
            ? "Yes (International)"
            : "No"
        }
        variant={
          useFieldState("customs_declaration").visible
            ? "warning"
            : "default"
        }
      />
    </Box>
  );
};

/**
 * Field state inspector — uses useFieldState for each field.
 */
const FieldStateInspector = () => {
  const fields = [
    "item_weight",
    "quantity",
    "shipping_type",
    "total_weight",
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
    logics: shippingLogics,
    onSubmit: (data) => {
      console.log("[ReactiveEngine Demo] Submitted:", data);
    },
  });

  // Register a custom condition via the SDK API
  const engine = form.getEngine();
  engine.addCondition("contains", ({ fieldValue, conditionValues }) => {
    return String(fieldValue).includes(String(conditionValues));
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
              A plugin-based reactive runtime for server-driven forms. Register
              conditions and actions via{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
                engine.addCondition()
              </code>{" "}
              /{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
                engine.addAction()
              </code>
              .
            </Label>
          </Box>
        </Box>
      </header>

      {/* Concepts */}
      <Box display="grid" gap="md" className="grid-cols-1 md:grid-cols-3">
        <ConceptCard
          icon={<Zap size={20} className="text-primary" />}
          title="Registry Pattern"
          desc="Conditions and actions are resolved from a Map at runtime. No hardcoded switch/if-else. Built-ins use the same API as custom operators."
        />
        <ConceptCard
          icon={<Plus size={20} className="text-primary" />}
          title="Extensible SDK"
          desc='engine.addCondition("contains", fn) — register custom operators with a single call. The engine is open for extension, closed for modification.'
        />
        <ConceptCard
          icon={<Eye size={20} className="text-primary" />}
          title="Server-Driven"
          desc="Logic rules come as raw JSON from the backend. The engine consumes them verbatim — no transformation step needed."
        />
      </Box>

      {/* SDK API Example */}
      <Card
        variant="default"
        padding="lg"
        radius="xl"
        className="border-border/50 bg-card/50"
      >
        <Box display="flex" direction="column" gap="sm">
          <Label variant="title" className="flex items-center gap-2">
            <Lock size={16} className="text-primary" />
            SDK API
          </Label>
          <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 text-xs font-mono text-foreground">
            {`// Register a custom condition
engine.addCondition("contains", ({ fieldValue, conditionValues }) => {
  return String(fieldValue).includes(String(conditionValues));
});

// Register a custom action
engine.addAction("sendNotification", ({ action }) => {
  notify(action.value);
  return {}; // return patches to field states
});

// Override the built-in "fetch" with your own API logic
engine.addAction("fetch", async ({ action, allValues }) => {
  const data = await api.get(\`/records/\${allValues.contactId}\`);
  return { gst_number: { value: data.gst } };
});`}
          </pre>
        </Box>
      </Card>

      {/* Live Demo */}
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
              This form is powered by{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
                FieldLogic[]
              </code>{" "}
              — pure JSON rules, no JS functions. The engine resolves every{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
                opr
              </code>{" "}
              from its registry.
            </Label>
          </Box>

          <div className="h-px w-full bg-border" />

          <FormContext.Provider value={form}>
            {/* The FormBuilder-driven form */}
            <FormBuilder
              config={shippingFormConfig}
              form={form}
              defaultValues={defaultValues}
            >
              <Button type="submit" variant="default">
                Submit
              </Button>
            </FormBuilder>

            <div className="h-px w-full bg-border" />

            {/* Computed Outputs */}
            <Label
              variant="subtitle"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Computed Outputs (via useWatch)
            </Label>
            <ComputedOutputs />

            {/* Field State Inspector */}
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
  variant?: "default" | "success" | "destructive" | "warning";
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
              : variant === "warning"
                ? "text-yellow-500"
                : "text-foreground"
        }`}
      >
        {value}
      </span>
    </Box>
  </Card>
);

export default ReactiveEngineDocs;
