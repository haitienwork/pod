import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "@/lib/shopify.server";
import Page from "@/components/ui/page";
import { useForm } from "react-hook-form";
import { useAppBridge } from "@shopify/app-bridge-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import Select from "@/components/ui/select";
import { BACKEND_URL } from "@/config/app.config";
import { useEffect } from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  // Get List products from Shopify
  const response = await admin.graphql(
    `query {
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }`,
  );

  const data = await response.json();

  // Get all templates for dropdown
  const temRes = await fetch(`${BACKEND_URL}/template?page=${1}&pageSize=100`);
  const template = (await temRes.json()) as { data: any[]; total: number };

  let configData = null as any;
  if (params.id !== "add") {
    const configRes = await fetch(
      `${BACKEND_URL}/config-products/${params.id}`,
    );
    configData = await configRes.json();
  }

  return {
    configData,
    products: data.data?.products?.edges?.map((n: any) => n.node),
    template: template,
  };
};

// Action
export const action: ActionFunction = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const { name, templateId, products } = Object.fromEntries(formData);
  const id = params.id
  const data = JSON.parse(products as string);

  try {
    // Add config to database
    const response = await fetch(`http://localhost:8080/config-products${id === 'add' ? '' : `/${id}`}`, {
      method: id === 'add' ? 'POST' : 'PUT' ,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, templateId, products: data }),
    });

    const configData = await response.json();

    // Update metafield of product
    // Docs: https://shopify.dev/docs/apps/build/custom-data/metafields/manage-metafields
    // 1. Create or Update meta field
    const metaRes = await Promise.all(
      data.map((p: ProductAddType) =>
        admin.graphql(`
      mutation {
            productUpdate(
            input : {
              id: "${p.shopifyId}",
              metafields: [
                {
                  namespace: "pod",
                  key: "personalize",
                  value: "${templateId}",
                  type: "single_line_text_field",
                }
              ]
            }) {
              product {
                metafields(first: 10) {
                  edges {
                    node {
                      value
                    }
                  }
                }
              }
            }
          }
        `),
      ),
    );

    return {
      configData,
    };
  } catch (error) {
    return { error };
  }
};

type ProductAddType = {
  id?: string;
  configId?: string;
  shopifyId: string;
  shopifyUrl: string;
  templateId?: string;
};

export default function Index() {
  const { configData, products, template } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const form = useForm({
    defaultValues: {
      name: configData?.name || "",
      products: configData?.products?.map((p: any) => p.shopifyUrl) || [],
      templateId: configData?.templateId || "",
    },
  });
  const shopify = useAppBridge();

  function handleSubmit(data: any) {
    const productsData: ProductAddType[] = data.products.map(
      (handle: string) => {
        const foundProduct = products.find((p: any) => p.handle === handle);

        return {
          shopifyId: foundProduct?.id,
          shopifyUrl: foundProduct?.handle,
          templateId: data.templateId,
        } as ProductAddType;
      },
    );

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("templateId", data.templateId);
    formData.append("products", JSON.stringify(productsData));

    fetcher.submit(formData, {
      method: "post",
    });
  }

  useEffect(() => {
    if (fetcher.data) {
      shopify.toast.show("Product Added");
    }
  }, [fetcher.data]);

  return (
    <Page
      title="Add Config Product"
      backHref="/app"
      showFooter
      idForm="add-product"
      isLoading={false}
    >
      <FormContext {...form}>
        <Form onSubmit={form.handleSubmit(handleSubmit)} id="add-product">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Configured product name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Configured product name"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <Card className="flex-1 bg-muted">
              <CardHeader>
                <CardTitle className="border-b pb-2">
                  Configured Option
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-2">
                <FormField
                  name="products"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Products</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={products?.map((p: any) => ({
                              value: p.handle,
                              label: p.title,
                            }))}
                            onValueChange={field.onChange}
                            selected={field.value}
                            optionShow="label"
                            placeholder="Choose Products"
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
                {/* Select Template */}
                <FormField
                  name="templateId"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Template</FormLabel>
                        <FormControl>
                          <Select
                            options={
                              template?.data.map((t) => ({
                                label: t.name,
                                value: t.id,
                              })) ?? []
                            }
                            onChange={field.onChange}
                            value={field.value}
                            placeholder="Choose Template"
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </CardContent>
            </Card>
            <Card className="flex-[2] bg-muted">
              <CardHeader>
                <CardTitle className="border-b">Preview</CardTitle>
                <CardContent className="space-y-4 !mt-4">
                  <div className="px-4 py-2 rounded-md bg-white">
                    Product Information
                  </div>
                  <div className="px-4 py-2 rounded-md bg-white">
                    Template Information
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </Form>
      </FormContext>
    </Page>
  );
}
