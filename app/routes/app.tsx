import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
// import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import stylesheet from "@/styles/tailwind.css?url";
import fonts from '@/styles/font.css?url'
import { authenticate } from "../lib/shopify.server";
import { Layout } from "@/components/ui/layout";

export const links = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: fonts },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <Layout backHref="/app" title="Personalify: Custom POD Product">
        <Outlet />
      </Layout>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
