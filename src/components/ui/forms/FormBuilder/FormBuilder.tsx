import * as React from "react";
import { type FormConfig } from "@components/ui/forms/FormBuilder/types";
import { useForm, FormContext, type UseFormOptions } from "@/hooks/useFormBuilder";
import FieldRenderer from "@components/ui/forms/FormBuilder/FieldRenderer";
import Box from "@components/ui/containers/Box/Box";

export interface FormBuilderProps extends UseFormOptions {
  config: FormConfig;
  children?: React.ReactNode;
  className?: string;
  form?: ReturnType<typeof useForm>; // Optional external form instance
}

export default function FormBuilder({
  config,
  defaultValues,
  onSubmit,
  rules,
  schema,
  children,
  className,
  form: externalForm,
}: FormBuilderProps) {
  const internalForm = useForm({ config, defaultValues, onSubmit, rules, schema });
  const form = externalForm || internalForm;

  return (
    <FormContext.Provider value={form}>
      <form ref={form.formRef} onSubmit={form.handleSubmit} className={className}>
        <Box display="flex" direction="column" gap="lg">
          {config?.sections?.map((section) => (
            <Box key={section.id} display="flex" direction="column" gap="md">
              {(section.title || section.description) && (
                <Box>
                  {section.title && <h3 className="text-lg font-semibold">{section.title}</h3>}
                  {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
                </Box>
              )}

              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `repeat(${section.columns || 1}, minmax(0, 1fr))` }}
              >
                {section.fields.map((field) => (
                  <div key={field.name} style={{ gridColumn: `span ${field.colSpan || 1}` }}>
                    <FieldRenderer field={field} />
                  </div>
                ))}
              </div>
            </Box>
          ))}
          {children && <Box className="pt-4 border-t border-border">{children}</Box>}
        </Box>
      </form>
    </FormContext.Provider>
  );
}
