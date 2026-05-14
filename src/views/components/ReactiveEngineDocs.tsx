import {
  Cpu,
  Zap,
  Eye,
  Plus,
  BookOpen,
  Code2,
  GitBranch,
  Settings,
  Layers,
  ArrowRight,
  Lock,
} from "lucide-react";
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
import Tabs from "@components/ui/containers/Tabs/Tabs";

// ─── Demo Data ───

const shippingLogics: FieldLogic[] = [
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
  {
    id: "disable_express",
    active: true,
    conditions: [
      { id: "c3", field: "total_weight", opr: "gt", values: 50, pos: 1 },
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
  {
    id: "enable_express",
    active: true,
    conditions: [
      { id: "c4", field: "total_weight", opr: "lte", values: 50, pos: 1 },
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
  {
    id: "compute_weight",
    active: true,
    conditions: [
      { id: "c5a", field: "item_weight", opr: "update", values: "", pos: 1 },
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
  total_weight: 10,
};

// ─── Code Snippets ───

const CODE_SNIPPETS = {
  architecture: `// Architecture: 3-Layer System
//
// 1. TYPES (types.ts)        → FieldLogic, ConditionEvaluator, ActionExecutor
// 2. ENGINE (engine.ts)      → Registry + Evaluator + Dispatcher
// 3. BUILTINS (builtins.ts)  → All built-in operators (uses same SDK API)
//
// Flow:
// Server JSON → useForm({ logics }) → ReactiveEngine
//   → User changes field
//   → engine.update(fieldId, value)
//   → Find affected logics (dependency graph)
//   → evaluateConditions() (lookup from registry)
//   → executeActions() (lookup from registry)
//   → FieldState patches → UI re-renders`,

  basicUsage: `import { useForm, FormContext } from "@/hooks/useFormBuilder";
import FormBuilder from "@components/ui/forms/FormBuilder/FormBuilder";
import type { FieldLogic } from "@/framework/reactive/types";
import type { FormConfig } from "@/components/ui/forms/FormBuilder/types";

// 1. Define your logic rules (or receive from API)
const logics: FieldLogic[] = [
  {
    id: "show_address",
    active: true,
    conditions: [
      { id: "c1", field: "has_shipping", opr: "eq", values: true, pos: 1 }
    ],
    actions: [
      { id: "a1", resourceType: "field", opr: "show", fields: ["address"] }
    ]
  }
];

// 2. Define form layout
const config: FormConfig = {
  id: "my-form",
  sections: [{
    id: "main",
    fields: [
      { name: "has_shipping", label: "Enable Shipping", type: "checkbox" },
      { name: "address", label: "Address", type: "text" },
    ]
  }]
};

// 3. Create the form
function MyForm() {
  const form = useForm({
    logics,
    defaultValues: { has_shipping: false, address: "" },
    onSubmit: (data) => console.log(data),
  });

  return (
    <FormBuilder config={config} form={form}>
      <Button type="submit">Save</Button>
    </FormBuilder>
  );
}`,

  logicStructure: `// A FieldLogic rule has 3 parts:
interface FieldLogic {
  id: string;          // Unique rule ID
  active: boolean;     // Toggle on/off without deleting
  conditions: [{       // WHEN these are true...
    id: string;
    field: string;     // Watch this field
    opr: string;       // Condition operator (from registry)
    values: unknown;   // Compare against this
    connector?: "and" | "or";  // Join with previous condition
    pos: number;       // Evaluation order
  }];
  actions: [{          // ...THEN do this
    id: string;
    resourceType: "field";
    opr: string;       // Action operator (from registry)
    fields: string[];  // Target field(s)
    valueType?: "static" | "fx";  // For "set" action
    value?: unknown;   // Static value or formula
  }];
}`,

  conditions: `// ─── Built-in Condition Operators ───

// "update"   → fires when the field changes (always true)
// "empty"    → field has no value (null, undefined, "", [])
// "notEmpty" → field has a value
// "eq"       → fieldValue === conditionValues
// "neq"      → fieldValue !== conditionValues
// "in"       → conditionValues.includes(fieldValue)
// "notIn"    → !conditionValues.includes(fieldValue)
// "gt"       → Number(fieldValue) > Number(conditionValues)
// "gte"      → Number(fieldValue) >= Number(conditionValues)
// "lt"       → Number(fieldValue) < Number(conditionValues)
// "lte"      → Number(fieldValue) <= Number(conditionValues)

// ─── Register your own ───
engine.addCondition("contains", ({ fieldValue, conditionValues }) => {
  return String(fieldValue).includes(String(conditionValues));
});

engine.addCondition("startsWith", ({ fieldValue, conditionValues }) => {
  return String(fieldValue).startsWith(String(conditionValues));
});

engine.addCondition("regex", ({ fieldValue, conditionValues }) => {
  return new RegExp(String(conditionValues)).test(String(fieldValue));
});`,

  actions: `// ─── Built-in Action Operators ───

// "set"     → set field value (static or formula "fx")
// "unset"   → clear field to undefined
// "show"    → set visible: true
// "hide"    → set visible: false
// "enable"  → set disabled: false
// "disable" → set disabled: true
// "fetch"   → stub (override with your API logic)
// "option"  → filter select options dynamically

// ─── Register your own ───
engine.addAction("setError", ({ action }) => {
  const patches = {};
  for (const fieldId of action.fields) {
    patches[fieldId] = { errors: [String(action.value)] };
  }
  return patches;
});

// Override "fetch" with real API logic
engine.addAction("fetch", async ({ action, allValues }) => {
  const res = await api.get(\`/records/\${allValues.contactId}\`);
  return { gst_number: { value: res.data.gst } };
});`,

  formulas: `// Formulas use {{id_FIELD_NAME}} placeholders
// The engine replaces them with actual values before evaluation

// Simple math
"{{id_price}} * {{id_quantity}}"           // → 50 * 3 = 150

// Multi-field computation
"{{id_subtotal}} + {{id_tax}} - {{id_discount}}"

// Use in a "set" action:
{
  opr: "set",
  valueType: "fx",               // "fx" = formula mode
  value: "{{id_price}} * {{id_qty}}",
  fields: ["total"]
}`,

  hooks: `// ─── useWatch ───
// Subscribe to a field's value. Re-renders when it changes.
function TotalDisplay() {
  const total = useWatch("total_weight");
  return <span>Total: {total} kg</span>;
}

// ─── useFieldState ───
// Subscribe to a field's full state (value, visible, disabled, errors).
function FieldDebug({ name }) {
  const { value, visible, disabled, errors } = useFieldState(name);
  return (
    <div>
      <span>Value: {value}</span>
      <span>Visible: {visible}</span>
      <span>Disabled: {disabled}</span>
    </div>
  );
}

// ─── getEngine() ───
// Access the engine instance to register custom operators.
function MyForm() {
  const form = useForm({ logics, defaultValues });
  const engine = form.getEngine();

  // Register custom operators before render
  engine.addCondition("myCustomOpr", (ctx) => { ... });

  return <FormBuilder config={config} form={form} />;
}`,

  multiCondition: `// Multiple conditions with AND/OR connectors
{
  id: "complex_rule",
  active: true,
  conditions: [
    // First condition (no connector — starts the chain)
    { id: "c1", field: "country", opr: "eq", values: "IN", pos: 1 },
    // AND: amount > 10000
    { id: "c2", field: "amount", opr: "gt", values: 10000,
      connector: "and", pos: 2 },
    // OR: is_vip is true
    { id: "c3", field: "is_vip", opr: "eq", values: true,
      connector: "or", pos: 3 },
  ],
  // Evaluates as: (country == "IN" AND amount > 10000) OR is_vip == true
  actions: [
    { id: "a1", resourceType: "field", opr: "show",
      fields: ["premium_support"] }
  ]
}`,
};

// ─── Sub-components (inside FormContext) ───

const ComputedOutputs = () => {
  const totalWeight = useWatch("total_weight");
  const expressState = useFieldState("express_notes");
  const customsState = useFieldState("customs_declaration");

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
        value={customsState.visible ? "Yes (International)" : "No"}
        variant={customsState.visible ? "warning" : "default"}
      />
    </Box>
  );
};

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
          <Chip variant="primary" size="sm" className="font-mono text-[10px]">
            {String(state.value ?? "—")}
          </Chip>
          <Chip
            variant={state.visible ? "success" : "error"}
            size="sm"
            className="text-[10px]"
          >
            {state.visible ? "visible" : "hidden"}
          </Chip>
          <Chip
            variant={state.disabled ? "error" : "success"}
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

// ─── Docs Tabs ───

type TabId =
  | "overview"
  | "usage"
  | "conditions"
  | "actions"
  | "formulas"
  | "hooks"
  | "playground";

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BookOpen size={14} /> },
  { id: "usage", label: "Basic Usage", icon: <Code2 size={14} /> },
  { id: "conditions", label: "Conditions", icon: <GitBranch size={14} /> },
  { id: "actions", label: "Actions", icon: <Zap size={14} /> },
  { id: "formulas", label: "Formulas", icon: <Settings size={14} /> },
  { id: "hooks", label: "Hooks", icon: <Layers size={14} /> },
  { id: "playground", label: "Playground", icon: <Eye size={14} /> },
];

// ─── Main Component ───

const ReactiveEngineDocs = () => {
  const form = useForm({
    defaultValues,
    logics: shippingLogics,
    onSubmit: (data) => console.log("[ReactiveEngine Demo] Submitted:", data),
  });

  const engine = form.getEngine();
  engine.addCondition("contains", ({ fieldValue, conditionValues }) =>
    String(fieldValue).includes(String(conditionValues)),
  );

  const tabItems = TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
    component: (
      <Box className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {tab.id === "overview" && <OverviewTab />}
        {tab.id === "usage" && (
          <CodeTab
            title="Basic Usage"
            subtitle="How to wire up a form with reactive logic in 3 steps."
            code={CODE_SNIPPETS.basicUsage}
          />
        )}
        {tab.id === "conditions" && (
          <Box display="flex" direction="column" gap="md">
            <CodeTab
              title="Condition Operators"
              subtitle="Built-in conditions and how to register custom ones."
              code={CODE_SNIPPETS.conditions}
            />
            <CodeTab
              title="Multiple Conditions (AND / OR)"
              subtitle="Chain conditions with connectors. Evaluated left-to-right by pos."
              code={CODE_SNIPPETS.multiCondition}
            />
          </Box>
        )}
        {tab.id === "actions" && (
          <CodeTab
            title="Action Operators"
            subtitle="Built-in actions and how to register custom ones."
            code={CODE_SNIPPETS.actions}
          />
        )}
        {tab.id === "formulas" && (
          <CodeTab
            title="Formula Expressions"
            subtitle='Use valueType: "fx" with {{id_FIELD}} placeholders for computed values.'
            code={CODE_SNIPPETS.formulas}
          />
        )}
        {tab.id === "hooks" && (
          <CodeTab
            title="React Hooks"
            subtitle="Subscribe to field values and states from any component inside FormContext."
            code={CODE_SNIPPETS.hooks}
          />
        )}
        {tab.id === "playground" && (
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
                  Try changing values below. The engine evaluates{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-primary">
                    FieldLogic[]
                  </code>{" "}
                  rules in real time — no JS functions, pure JSON operators
                  resolved from the registry.
                </Label>
              </Box>

              <div className="h-px w-full bg-border" />

              <FormContext.Provider value={form}>
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

                <Label
                  variant="subtitle"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Computed Outputs (via useWatch)
                </Label>
                <ComputedOutputs />

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
        )}
      </Box>
    ),
  }));

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
              A plugin-based reactive runtime for server-driven forms. All
              operators are registered via the same SDK API — built-ins and
              custom operators are treated identically.
            </Label>
          </Box>
        </Box>
      </header>

      {/* Concepts */}
      <Box display="grid" gap="md" className="grid-cols-1 md:grid-cols-3">
        <ConceptCard
          icon={<Zap size={20} className="text-primary" />}
          title="Registry Pattern"
          desc="Conditions and actions are resolved from a Map at runtime. Zero hardcoded switch/if-else."
        />
        <ConceptCard
          icon={<Plus size={20} className="text-primary" />}
          title="Extensible SDK"
          desc='engine.addCondition("opr", fn) — one call to register. Open for extension, closed for modification.'
        />
        <ConceptCard
          icon={<Lock size={20} className="text-primary" />}
          title="Server-Driven"
          desc="Logic rules come as raw JSON from the backend. No transformation needed."
        />
      </Box>

      {/* Reusable Tabs Component */}
      <Tabs
        defaultValue="overview"
        variant="enclosed"
        keepMounted
        items={tabItems}
      />
    </Box>
  );
};

// ─── Overview Tab ───

const OverviewTab = () => (
  <Box display="flex" direction="column" gap="md">
    {/* Architecture */}
    <CodeTab
      title="Architecture"
      subtitle="The engine is a 3-layer system: Types → Engine (registry + evaluator) → Builtins."
      code={CODE_SNIPPETS.architecture}
    />

    {/* Logic Structure */}
    <CodeTab
      title="FieldLogic Structure"
      subtitle="Each logic rule matches the server JSON exactly. No transformation needed."
      code={CODE_SNIPPETS.logicStructure}
    />

    {/* How It Works */}
    <Card
      variant="default"
      padding="lg"
      radius="xl"
      className="border-border/50"
    >
      <Box display="flex" direction="column" gap="md">
        <Label variant="title" className="flex items-center gap-2">
          <GitBranch size={16} className="text-primary" />
          How It Works
        </Label>
        <Box display="flex" direction="column" gap="sm">
          <StepItem step={1} title="Engine bootstraps">
            Constructor calls <InlineCode>registerBuiltins(this)</InlineCode>{" "}
            which registers all built-in operators via the public{" "}
            <InlineCode>addCondition</InlineCode> /{" "}
            <InlineCode>addAction</InlineCode> API.
          </StepItem>
          <StepItem step={2} title="Logics are loaded">
            <InlineCode>engine.load(logics, initialValues)</InlineCode> builds a
            dependency graph:{" "}
            <InlineCode>condition.field → logic rule IDs</InlineCode>.
          </StepItem>
          <StepItem step={3} title="User changes a field">
            <InlineCode>engine.update(fieldId, value)</InlineCode> looks up all
            affected logics from the dependency graph.
          </StepItem>
          <StepItem step={4} title="Conditions are evaluated">
            Each condition's <InlineCode>opr</InlineCode> is looked up from the
            condition registry. Conditions chain with{" "}
            <InlineCode>and</InlineCode> / <InlineCode>or</InlineCode>{" "}
            connectors.
          </StepItem>
          <StepItem step={5} title="Actions are executed">
            If conditions pass, each action's <InlineCode>opr</InlineCode> is
            looked up from the action registry. Returns{" "}
            <InlineCode>FieldState</InlineCode> patches.
          </StepItem>
          <StepItem step={6} title="UI re-renders">
            Patches notify subscribers (<InlineCode>useWatch</InlineCode> /{" "}
            <InlineCode>useFieldState</InlineCode>). Only affected fields
            re-render.
          </StepItem>
        </Box>
      </Box>
    </Card>

    {/* File Map */}
    <Card
      variant="default"
      padding="lg"
      radius="xl"
      className="border-border/50"
    >
      <Box display="flex" direction="column" gap="md">
        <Label variant="title" className="flex items-center gap-2">
          <Layers size={16} className="text-primary" />
          File Map
        </Label>
        <Box display="flex" direction="column" gap="xs">
          <FileMapRow
            path="framework/reactive/types.ts"
            desc="All type definitions — FieldLogic, ConditionEvaluator, ActionExecutor"
          />
          <FileMapRow
            path="framework/reactive/engine.ts"
            desc="Registry-based engine core — addCondition(), addAction(), update()"
          />
          <FileMapRow
            path="framework/reactive/builtins.ts"
            desc="Built-in operators registered via the public SDK API"
          />
          <FileMapRow
            path="hooks/useFormBuilder.ts"
            desc="useForm, useWatch, useFieldState — React bindings"
          />
          <FileMapRow
            path="components/ui/forms/FormBuilder/"
            desc="FormBuilder, FieldRenderer — declarative form rendering"
          />
        </Box>
      </Box>
    </Card>
  </Box>
);

// ─── Reusable UI Pieces ───

const CodeTab = ({
  title,
  subtitle,
  code,
}: {
  title: string;
  subtitle: string;
  code: string;
}) => (
  <Card
    variant="default"
    padding="lg"
    radius="xl"
    className="border-border/50 bg-card/50"
  >
    <Box display="flex" direction="column" gap="sm">
      <Label variant="title" className="flex items-center gap-2">
        <Code2 size={16} className="text-primary" />
        {title}
      </Label>
      <Label variant="subtitle">{subtitle}</Label>
      <pre className="overflow-x-auto rounded-lg bg-muted/50 p-4 text-[11px] leading-relaxed font-mono text-foreground">
        {code}
      </pre>
    </Box>
  </Card>
);

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
        className={`text-lg font-bold tracking-tight ${variant === "success" ? "text-green-500" : variant === "destructive" ? "text-destructive" : variant === "warning" ? "text-yellow-500" : "text-foreground"}`}
      >
        {value}
      </span>
    </Box>
  </Card>
);

const StepItem = ({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) => (
  <Box display="flex" gap="sm" align="start">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
      {step}
    </span>
    <Box display="flex" direction="column" gap="xs">
      <Label variant="subtitle" className="font-semibold text-foreground">
        {title}
      </Label>
      <Label variant="subtitle" className="text-xs">
        {children}
      </Label>
    </Box>
  </Box>
);

const FileMapRow = ({ path, desc }: { path: string; desc: string }) => (
  <Box
    display="flex"
    align="center"
    gap="sm"
    className="rounded-lg px-3 py-2 hover:bg-muted/50 transition-colors"
  >
    <ArrowRight size={12} className="shrink-0 text-primary" />
    <code className="shrink-0 text-xs font-mono text-primary">{path}</code>
    <span className="text-xs text-muted-foreground">— {desc}</span>
  </Box>
);

const InlineCode = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-primary">
    {children}
  </code>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <Label
    variant="subtitle"
    className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
  >
    {children}
  </Label>
);

export default ReactiveEngineDocs;
