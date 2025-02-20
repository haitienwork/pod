import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "@/lib/shopify.server";
import Page from "@/components/ui/page";
import { useFieldArray, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as FormContext,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { TemplateGenerator } from "@/lib/template-generator";
import { BACKEND_URL } from "@/config/app.config";
import { useEffect } from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  const id = params.id;
  if (id === "add")
    return {
      template: null,
    };

  const res = await fetch(`${BACKEND_URL}/template/${id}`);
  const template = await res.json();

  return {
    template,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const { admin } = await authenticate.admin(request);

  try {
    // Parse fields from form data
    const fields = JSON.parse(data.fields as string);

    // Generate liquid template
    const htmlContent = TemplateGenerator.generateHTML(fields).normalize();
    const formData = {
      name: data.name,
      html: htmlContent,
      fields,
    };

    const res = await fetch(`${BACKEND_URL}/template`, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    const template = await res.json();
    return {
      template,
    };
  } catch (error) {
    console.error("Error creating template:", error);
    return { error: "Failed to create template" };
  }
};

interface FormValues {
  name: string;
  fields: any;
}

export default function TemplateAddPage() {
  const { template } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const form = useForm<FormValues>({
    defaultValues: {
      name: template?.name,
      fields: template?.fields ?? [
        {
          label: "Field 1",
          name: "Field Label 1",
          order: 0,
          type: "TEXT",
        },
      ],
    },
  });
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("fields", JSON.stringify(data.fields));
    fetcher.submit(formData, { method: "post" });
  };

  useEffect(() => {
    if (fetcher.data) {
      shopify.toast.show("Template Added!");
    }
  }, [fetcher.data]);

  return (
    <Page
      title={template ? "Edit Template" : "Add Template"}
      backHref="/app/template"
      showFooter
      idForm="submit-form"
      isLoading={fetcher.state === "submitting"}
    >
      <FormContext {...form}>
        <Form onSubmit={form.handleSubmit(onSubmit)} id="submit-form">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input placeholder="Template Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4 mt-2">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-4 items-start p-4 border rounded-md"
              >
                <div className="flex-1 space-y-4">
                  <div>
                    <Label>Field Name</Label>
                    <Input
                      {...form.register(`fields.${index}.name`, {
                        required: "Vui lòng nhập label",
                      })}
                    />
                  </div>
                  <div>
                    <Label>Field Label</Label>
                    <Input
                      {...form.register(`fields.${index}.label`, {
                        required: "Vui lòng nhập label",
                      })}
                    />
                  </div>
                  <div>
                    <Label>Default Value</Label>
                    <Input
                      {...form.register(`fields.${index}.defaultValue`)}
                    />
                  </div>

                  <div>
                    <Label>Field Type</Label>
                    <Select
                      onChange={(value) => {
                        const currentField = form.watch(`fields.${index}`);
                        const updatedField = {
                          ...currentField,
                          type: value as "TEXT" | "TEXTAREA" | "DROPDOWN",
                          options:
                            value === "DROPDOWN"
                              ? currentField.options
                              : undefined,
                        };

                        const fields = form.watch("fields");
                        fields[index] = updatedField;
                        form.reset({ ...form.watch(), fields });
                      }}
                      value={form.watch(`fields.${index}.type`)}
                      options={[
                        { value: "TEXT", label: "Text Input" },
                        { value: "TEXTAREA", label: "Text Area" },
                        { value: "DROPDOWN", label: "Dropdown" },
                      ]}
                    />
                  </div>

                  {form.watch(`fields.${index}.type`) === "DROPDOWN" && (
                    <div>
                      <Label>Options (comma separated)</Label>
                      <Input
                        {...form.register(`fields.${index}.options`, {
                          required: "Vui lòng nhập các options",
                        })}
                      />
                    </div>
                  )}
                </div>

                <div className="space-x-2">
                  <Button
                    type="button"
                    // @ts-ignore
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="button"
            // @ts-ignore
            variant="outline"
            onClick={() =>
              append({
                name: `Field ${fields.length}`,
                label: `Field Label ${fields.length}`,
                type: "TEXT",
                order: fields.length,
              })
            }
            size="sm"
            icon={Plus}
            iconPlacement="left"
            className="mt-2"
          >
            More Fields
          </Button>
        </Form>
      </FormContext>
    </Page>
  );
}
