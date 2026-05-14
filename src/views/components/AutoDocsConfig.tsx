import Button from "../../components/ui/inputs/Button/Button";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/ui/containers/Accordion/Accordion";
import { PopoverContent } from "../../components/ui/containers/Popover/Popover";
import {
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/display/Tooltip/Tooltip";
import { VirtualizedGrid } from "../../components/ui/display/Grid/VirtualizedGrid";
export interface PreviewConfig {
  defaultProps?: Record<string, unknown>;
  renderAll?: string[];
  customSections?: { title: string; items: Record<string, unknown>[] }[];
}

const selectOptions = [
  {
    id: "opt-1",
    label: "Buopso",
    icon: <div className="h-2 w-2 rounded-full bg-primary" />,
    description: "Advanced logistics and fulfillment engine",
  },
  {
    id: "opt-2",
    label: "Shipkia",
    icon: <div className="h-2 w-2 rounded-full bg-success" />,
  },
  {
    id: "opt-3",
    label: "Hers",
    icon: <div className="h-2 w-2 rounded-full bg-warning" />,
    disabled: true,
  },
];

const virtualSelectOptions = Array.from({ length: 10000 }, (_, i) => ({
  id: `opt-${i}`,
  label: `Option ${i + 1}`,
  description:
    i % 10 ? `This is the description for option ${i + 1}` : undefined,
  icon: (
    <div
      className={`h-2 w-2 rounded-full ${i % 2 === 0 ? "bg-primary" : "bg-success"}`}
    />
  ),
}));

export const autoDocsConfig: Record<string, PreviewConfig> = {
  Button: {
    defaultProps: { children: "Button" },
    renderAll: ["variant", "size"],
  },
  Input: {
    defaultProps: { placeholder: "Enter value...", label: "Input" },
    renderAll: ["variant", "size"],
  },
  Checkbox: {
    defaultProps: { label: "Checkbox" },
    renderAll: ["disabled"],
  },
  Switch: {
    defaultProps: { label: "Switch" },
    renderAll: ["disabled"],
  },
  Radio: {
    defaultProps: {
      options: [
        { id: "1", label: "Option 1" },
        { id: "2", label: "Option 2" },
      ],
    },
  },
  CheckboxGroup: {
    defaultProps: {
      options: [
        { id: "1", label: "Option 1" },
        { id: "2", label: "Option 2" },
      ],
    },
  },
  Select: {
    defaultProps: {
      label: "Select",
      placeholder: "Enter value...",
      options: selectOptions,
    },
    renderAll: ["variant", "multi"],
    customSections: [
      {
        title: "Virtualized Select (10,000 items)",
        items: [
          { variant: "outline", multi: false, options: virtualSelectOptions },
          { variant: "outline", multi: true, options: virtualSelectOptions },
        ],
      },
      {
        title: "Standard Examples",
        items: [
          { variant: "outline", multi: false, options: selectOptions },
          { variant: "outline", multi: true, options: selectOptions },
        ],
      },
      {
        title: "More Variants",
        items: [
          { variant: "button", multi: false, options: selectOptions },
          { variant: "ghost", multi: false, options: selectOptions },
        ],
      },
    ],
  },
  Autocomplete: {
    defaultProps: {
      label: "Autocomplete",
      placeholder: "Search or type...",
      options: selectOptions,
    },
    renderAll: ["multi", "allowCustom"],
    customSections: [
      {
        title: "Standard Examples",
        items: [
          { multi: false, allowCustom: false, options: selectOptions },
          { multi: true, allowCustom: false, options: selectOptions },
          { multi: false, allowCustom: true, options: selectOptions },
        ],
      },
      {
        title: "Virtualized Autocomplete (10,000 items)",
        items: [
          { multi: false, options: virtualSelectOptions },
          { multi: true, options: virtualSelectOptions },
        ],
      },
    ],
  },
  Modal: {
    defaultProps: {
      trigger: <Button>Open Modal</Button>,
      title: "Example Modal",
      content: "This is the content of the overlay.",
      children: "This is the children of the overlay.",
    },
  },
  Drawer: {
    defaultProps: {
      trigger: <Button>Open Drawer</Button>,
      title: "Example Drawer",
      content: "This is the content of the overlay.",
      children: "This is the children of the overlay.",
    },
  },
  Accordion: {
    defaultProps: {
      type: "single",
      collapsible: true,
      className: "w-full",
      children: (
        <>
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components' aesthetic.
            </AccordionContent>
          </AccordionItem>
        </>
      ),
    },
  },
  Popover: {
    defaultProps: {
      trigger: <Button variant="outline">Open Popover</Button>,
      children: (
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
          </div>
        </PopoverContent>
      ),
    },
  },
  Box: {
    defaultProps: {
      padding: "md",
      radius: "md",
      children: "Box Content",
    },
    customSections: [
      {
        title: "Layout Variants",
        items: [
          { variant: "default", children: "Default Container" },
          { variant: "glass", children: "Glass Container" },
          { variant: "outline", children: "Outline Container" },
        ],
      },
      {
        title: "Layout",
        items: [
          {
            display: "flex",
            gap: "md",
            children: (
              <>
                <Button>1</Button>
                <Button>2</Button>
              </>
            ),
          },
          {
            display: "grid",
            gap: "md",
            className: "grid-cols-2",
            children: (
              <>
                <div className="h-10 w-full bg-primary" />
                <div className="h-10 w-full bg-success" />
              </>
            ),
          },
        ],
      },
    ],
  },
  Card: {
    defaultProps: {
      variant: "glass",
      padding: "md",
      radius: "2xl",
      children: (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Premium Card</h3>
          <p className="text-sm opacity-80">
            This is a glassmorphic card component.
          </p>
        </div>
      ),
    },
    customSections: [
      {
        title: "Card Variants",
        items: [
          { variant: "default", children: "Default Card" },
          { variant: "glass", children: "Glass Card" },
          { variant: "outline", children: "Outline Card" },
          { variant: "ghost", children: "Ghost Card" },
        ],
      },
      {
        title: "Interactive",
        items: [{ interactive: true, children: "Hover me!" }],
      },
    ],
  },
  Label: {
    defaultProps: {
      variant: "title",
      children: "The quick brown fox",
    },
    customSections: [
      {
        title: "Typography Variants",
        items: [
          { variant: "heading", children: "Heading Text" },
          { variant: "subheading", children: "Subheading Text" },
          { variant: "title", children: "Title Text" },
          { variant: "subtitle", children: "Subtitle Text" },
          { variant: "body", children: "Body Text" },
          { variant: "label", children: "LABEL TEXT" },
        ],
      },
    ],
  },
  FormBuilder: {
    defaultProps: {
      config: {
        id: "demo-form",
        sections: [
          {
            id: "personal-info",
            title: "Personal Information",
            description: "Please enter your details below.",
            columns: 2,
            fields: [
              {
                name: "firstName",
                label: "First Name",
                type: "text",
                required: true,
              },
              {
                name: "lastName",
                label: "Last Name",
                type: "text",
                required: true,
              },
              {
                name: "email",
                label: "Email Address",
                type: "email",
                colSpan: 2,
              },
            ],
          },
          {
            id: "preferences",
            title: "Preferences",
            fields: [
              {
                name: "theme",
                label: "Favorite Theme",
                type: "select",
                options: [
                  { label: "Dark", value: "dark" },
                  { label: "Light", value: "light" },
                  { label: "System", value: "system" },
                ],
              },
              {
                name: "newsletter",
                label: "Subscribe to Newsletter",
                type: "switch",
              },
            ],
          },
        ],
      },
      onSubmit: (data: Record<string, unknown>) =>
        console.log("Form submitted", data),
      children: <Button type="submit">Submit Form</Button>,
    },
  },
  Tooltip: {
    defaultProps: {
      children: (
        <>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </>
      ),
    },
  },
  Truncate: {
    defaultProps: {
      className: "w-[200px] border border-border p-2 rounded-md bg-muted/30",
      children:
        "This is a very long text that will be truncated and show a tooltip on hover when it overflows.",
    },
  },
  Chip: {
    defaultProps: {
      label: "Active Status",
      variant: "success",
    },
    customSections: [
      {
        title: "Variants",
        items: [
          { variant: "primary", label: "Primary" },
          { variant: "secondary", label: "Secondary" },
          { variant: "success", label: "Success" },
          { variant: "warning", label: "Warning" },
          { variant: "danger", label: "Danger" },
          { variant: "outline", label: "Outline" },
        ],
      },
    ],
  },
  Skeleton: {
    defaultProps: {
      className: "w-[250px] h-32 rounded-xl",
    },
    customSections: [
      {
        title: "Common Shapes",
        items: [
          { className: "w-12 h-12 rounded-full" },
          { className: "w-[200px] h-4" },
          { className: "w-[150px] h-4" },
        ],
      },
    ],
  },
  Grid: {
    defaultProps: {
      className: "h-[300px]",
      selectable: true,
      columns: [
        { id: "id", label: "ID", type: "text", width: 100 },
        { id: "name", label: "Full Name", type: "text", flex: 1 },
        {
          id: "role",
          label: "Role",
          type: "select",
          options: [
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
          ],
          width: 150,
        },
        {
          id: "active",
          label: "Active",
          type: "checkbox",
          width: 100,
          align: "center",
        },
      ],
      data: [
        { id: "1", name: "Alice Johnson", role: "admin", active: true },
        { id: "2", name: "Bob Smith", role: "user", active: false },
        { id: "3", name: "Charlie Davis", role: "user", active: true },
        { id: "4", name: "Diana Prince", role: "admin", active: true },
      ],
    },
  },
  EditableGrid: {
    defaultProps: {
      className: "h-[300px]",
      selectable: true,
      columns: [
        { id: "id", label: "ID", type: "text", width: 60 },
        { id: "name", label: "Name", type: "text", width: 150 },
        { id: "email", label: "Email", type: "email", width: 200 },
        { id: "password", label: "Password", type: "password", width: 120 },
        { id: "age", label: "Age", type: "number", width: 80 },
        {
          id: "role",
          label: "Role",
          type: "select",
          options: [
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
          ],
          width: 120,
        },
        {
          id: "active",
          label: "Active",
          type: "checkbox",
          width: 80,
          align: "center",
        },
        {
          id: "notify",
          label: "Notify",
          type: "switch",
          width: 80,
          align: "center",
        },
      ],
      data: [
        {
          id: "1",
          name: "Alice Johnson",
          email: "alice@example.com",
          password: "password123",
          age: 28,
          role: "admin",
          active: true,
          notify: true,
        },
        {
          id: "2",
          name: "Bob Smith",
          email: "bob@example.com",
          password: "secret",
          age: 34,
          role: "user",
          active: false,
          notify: false,
        },
      ],
    },
  },
  VirtualizedGrid: {
    defaultProps: {
      className: "h-[400px]",
      selectable: true,
      columns: [
        { id: "id", label: "ID", type: "text", width: 80 },
        { id: "name", label: "Name", type: "text", flex: 1 },
        { id: "role", label: "Role", type: "text", width: 150 },
      ],
      data: Array.from({ length: 1000 }).map((_, i) => ({
        id: `${i + 1}`,
        name: `Virtual User ${i + 1}`,
        role: i % 2 === 0 ? "admin" : "user",
      })),
    },
    customSections: [
      {
        title: "Editable + Virtualized Combo",
        items: [
          {
            gridComponent: VirtualizedGrid,
          },
        ],
      },
    ],
  },
};
