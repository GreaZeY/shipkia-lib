import { Suspense, lazy, useMemo } from "react";
import { useParams } from "react-router-dom";
import metadata from "../../lib/docs/metadata.json";
import Button from "../../components/ui/inputs/Button/Button";
import { Info, Layers } from "lucide-react";
import Label from "../../components/ui/typography/Label/Label";
import Container from "../../components/ui/containers/Container/Container";
import Box from "../../components/ui/containers/Box/Box";
import Card from "../../components/ui/containers/Card/Card";
import { autoDocsConfig } from "./AutoDocsConfig";
import Skeleton from "../../components/ui/display/Skeleton/Skeleton";
import { TooltipProvider } from "../../components/ui/display/Tooltip/Tooltip";
import { cn } from "../../lib/utils";

interface DocPropType {
  name: string;
  value?: { value: string }[];
}

interface DocProp {
  name: string;
  description?: string;
  required: boolean;
  type?: DocPropType;
  defaultValue?: { value: string } | null;
}

interface DocMetadata {
  name: string;
  path: string;
  description?: string;
  props: Record<string, DocProp>;
}

interface PreviewSection {
  title: string;
  items: Record<string, unknown>[];
}

const AutoDocs = () => {
  const { componentName } = useParams();

  const componentMeta = useMemo(() => {
    const key = componentName?.toLowerCase() || "";
    return (metadata as unknown as Record<string, DocMetadata>)[key];
  }, [componentName]);

  // Dynamically import the component for preview
  const ComponentPreview = useMemo(() => {
    if (!componentMeta || !componentMeta.path) return null;

    // Use the path directly from metadata, removing '/src' if present for relative import
    const relativePath = componentMeta.path.replace("/src/", "../../");

    return lazy(() =>
      import(/* @vite-ignore */ relativePath).then((module) => {
        // Handle both default and named exports
        const name = componentMeta.name;
        return { default: module.default || module[name] };
      }),
    );
  }, [componentMeta]);

  const previewSections = useMemo<PreviewSection[]>(() => {
    if (!componentMeta) return [];

    const config = autoDocsConfig[componentMeta.name];

    const sections: PreviewSection[] = [];

    // 1. Add auto-generated sections from renderAll
    const propsToRender = config?.renderAll || ["variant", "size", "type"];
    const autoSections: PreviewSection[] = [];
    propsToRender.forEach((propName) => {
      const prop = componentMeta.props[propName];
      if (!prop) return;

      let values: (string | boolean)[] = [];
      if (prop.type?.name === "enum" && prop.type.value) {
        values = prop.type.value.map((v) => {
          if (v.value === "true") return true;
          if (v.value === "false") return false;
          return v.value.replace(/^"|"$/g, "");
        });
      } else if (prop.type?.name.includes("|")) {
        values = prop.type.name
          .split("|")
          .map((s: string) => s.trim().replace(/^"|"$/g, ""))
          .filter(
            (s: string) =>
              s !== "null" &&
              s !== "undefined" &&
              s !== "string" &&
              s !== "boolean",
          );
      } else if (prop.type?.name === "boolean") {
        values = [true, false];
      }

      if (values.length > 0) {
        autoSections.push({
          title: propName.charAt(0).toUpperCase() + propName.slice(1) + "s",
          items: values.map((v) => ({ [propName]: v })),
        });
      }
    });

    if (autoSections.length > 0) {
      sections.push(...autoSections);
    }

    // 2. Add custom sections
    if (config?.customSections) {
      sections.push(...config.customSections);
    }

    if (sections.length === 0) {
      sections.push({
        title: "Preview",
        items: [{}],
      });
    }

    return sections;
  }, [componentMeta]);

  if (!componentMeta) {
    return (
      <Box
        display="flex"
        direction="column"
        align="center"
        justify="center"
        gap="md"
        className="min-h-[60vh]"
      >
        <Card className="bg-muted/30">
          <Layers size={40} className="text-muted-foreground" />
        </Card>
        <Label variant="title">Component Not Found</Label>
        <Label variant="subtitle">
          The component "{componentName}" does not exist in the UI library.
        </Label>
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
      </Box>
    );
  }

  const componentConfig = autoDocsConfig[componentMeta.name];

  return (
    <Container
      key={componentName}
      className="duration-500 animate-in fade-in slide-in-from-bottom-4"
      padding="none"
    >
      <Box display="flex" direction="column" gap="lg" padding="md">
        <header>
          <Box display="flex" direction="column" gap="xs">
            <Label variant="heading">{componentMeta.name}</Label>
            <Label variant="subheading">
              {componentMeta.description ||
                `Comprehensive documentation for the ${componentMeta.name} component.`}
            </Label>
          </Box>
        </header>

        {/* Live Preview */}
        <section className="space-y-8">
          {previewSections.map((section, sectionIndex) => (
            <Box key={sectionIndex} display="flex" direction="column" gap="sm">
              <Label variant="title">{section.title}</Label>

              <Box
                display="grid"
                gap="md"
                className={cn(
                  "grid-cols-1",
                  section.items.length === 2 && "md:grid-cols-2",
                  section.items.length >= 3 && "md:grid-cols-2 lg:grid-cols-3",
                )}
              >
                {section.items.map((propsCombination, index) => {
                  const labels = Object.entries(propsCombination)
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => {
                      if (Array.isArray(value)) {
                        return `${key}: [${value.length} items]`;
                      }
                      if (typeof value === "object" && value !== null) {
                        return `${key}: [Object]`;
                      }
                      return `${key}: ${String(value)}`;
                    });
                  const permLabel =
                    labels.length > 0 ? labels.join(", ") : "Default Preview";

                  return (
                    <Box key={index} display="flex" direction="column" gap="sm">
                      <Label variant="label">{permLabel}</Label>
                      <div className="relative my-4 w-full min-w-0 overflow-x-auto rounded-xl border border-border bg-background p-4 sm:p-12">
                        {/* Dot pattern background for contrast */}
                        <div
                          className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.08]"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle, currentColor 1px, transparent 1px)",
                            backgroundSize: "16px 16px",
                          }}
                        />

                        {/* Actual Component Wrapper */}
                        <div className="relative z-10 w-full min-w-0">
                          <Suspense
                            fallback={
                              <div className="flex w-full max-w-md flex-col gap-2 px-4">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                            }
                          >
                            {ComponentPreview && (
                              <TooltipProvider>
                                <div className="w-full">
                                  <ComponentPreview
                                    {...(componentConfig?.defaultProps || {})}
                                    {...propsCombination}
                                  />
                                </div>
                              </TooltipProvider>
                            )}
                          </Suspense>
                        </div>
                      </div>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </section>

        {/* Props Table */}
        <section className="space-y-4">
          <Box
            display="flex"
            align="center"
            justify="between"
            className="border-b border-border pb-3"
          >
            <Label variant="title">API Reference</Label>
            <Box display="flex" align="center" gap="xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success"></span>
              <Label variant="label">Live from source</Label>
            </Box>
          </Box>

          <Card padding="none" className="overflow-x-auto bg-card/30">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3">
                    <Label variant="label">Prop</Label>
                  </th>
                  <th className="px-6 py-3">
                    <Label variant="label">Type</Label>
                  </th>
                  <th className="px-6 py-3">
                    <Label variant="label">Default</Label>
                  </th>
                  <th className="px-6 py-3">
                    <Label variant="label">Description</Label>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {Object.entries(componentMeta.props).map(
                  ([name, prop]: [string, DocProp]) => (
                    <tr
                      key={name}
                      className="group transition-colors hover:bg-muted/20"
                    >
                      <td className="px-6 py-4">
                        <Box display="flex" direction="column" gap="none">
                          <code className="text-sm font-bold tracking-tight text-primary">
                            {name}
                          </code>
                          {prop.required && (
                            <span className="mt-0.5 text-[8px] font-black uppercase tracking-wider text-destructive">
                              Required
                            </span>
                          )}
                        </Box>
                      </td>
                      <td className="px-6 py-4">
                        <code className="inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {prop.type?.name === "enum" && prop.type?.value
                            ? prop.type.value.map((v) => v.value).join(" | ")
                            : prop.type?.name || "any"}
                        </code>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-muted-foreground/60">
                        {prop.defaultValue?.value || "—"}
                      </td>
                      <td className="max-w-sm px-6 py-4 text-[11px] leading-relaxed text-muted-foreground">
                        {prop.description || "No description provided."}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </Card>
        </section>

        {/* Developer Insight */}
        <Card
          variant="outline"
          padding="md"
          radius="lg"
          className="border-primary/10 bg-primary/5"
        >
          <Box display="flex" align="start" gap="md">
            <Box
              display="flex"
              align="center"
              justify="center"
              className="h-10 w-10 shrink-0 rounded-lg bg-primary/20"
            >
              <Info size={20} className="text-primary" />
            </Box>
            <Box display="flex" direction="column" gap="xs">
              <Label variant="title">Developer Insight</Label>
              <Label variant="subtitle">
                This documentation is synchronized with the actual source code.
                Any changes made to the component's interfaces or JSDoc comments
                will be reflected here after generating the docs.
              </Label>
            </Box>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default AutoDocs;
