import { useEffect, useMemo } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

import { authenticate } from "../lib/shopify.server";
import Page from "@/components/ui/page";
import { Tabs } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "@/components/columns/index.columns";
import { BACKEND_URL } from "@/config/app.config";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");

  // Get list products configured
  const productRes = await fetch(
    `${BACKEND_URL}/config-products?page=${page}&pageSize=${pageSize}`,
  );
  const configProducts = (await productRes.json()) as {
    data: any[];
    total: number;
  };

  const uniqueProductHandle = new Set();
  configProducts.data.forEach((c) => {
    c.products.forEach((p: any) => {
      uniqueProductHandle.add(p.shopifyUrl);
    });
  });

  // Get all templates for dropdown
  const temRes = await fetch(`${BACKEND_URL}/template?page=${1}&pageSize=100`);
  const template = (await temRes.json()) as { data: any[]; total: number };

  // Get Image of products
  const response = await admin.graphql(
    `#graphql
    query {
      products(first: 100, query: "handle:${Array.from(uniqueProductHandle)}") {
        edges {
          node {
            handle
            media(first: 1) {
              nodes {
                preview {
                  image {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }`,
  );

  const data = await response.json();

  const medias = data.data.products.edges
    .map((n: any) => n.node)
    .map((m: any) => ({
      handle: m.handle,
      url: m.media.nodes[0].preview.image.url,
    })) as any[];

  return {
    configProducts,
    template,
    medias
  };
};

export default function Index() {
  const { configProducts, template, medias } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const currentPage = useMemo(
    () => parseInt(searchParams.get("page") || "1"),
    [searchParams],
  );
  const currentPageSize = useMemo(
    () => parseInt(searchParams.get("pageSize") || "10"),
    [searchParams],
  );

  function handleAddConfigProduct() {
    navigate("/app/add", {
      state: {
        activeTab: "configured-products",
        pagination: {
          pageIndex: currentPage,
          pageSize: currentPageSize,
        },
      },
    });
  }

  function handleEditConfigProduct(id: string) {
    navigate(`/app/${id}`, {
      state: {
        activeTab: "configured-products",
        pagination: {
          pageIndex: currentPage,
          pageSize: currentPageSize,
        },
      },
    });
  }

  const columns = useMemo(
    () => getColumns({ template: template.data, handleEditConfigProduct, medias }),
    [searchParams],
  );

  useEffect(() => {
    if (state?.pagination) {
      setSearchParams((prev) => {
        prev.set("page", state.pagination.pageIndex.toString());
        prev.set("pageSize", state.pagination.pageSize.toString());
        return prev;
      });
    }
  }, [state]);

  return (
    <Page>
      <Tabs />
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border p-2 flex items-center gap-2 h-9">
              <Checkbox />
              <ChevronDown size={16} />
            </div>
            <Input
              placeholder="Search product by title"
              startIcon={SearchIcon}
              className="w-[300px]"
            />
            <div>
              <Select
                placeholder="Filter Template"
                options={
                  template?.data.map((t) => ({
                    label: t.name,
                    value: t.id,
                  })) ?? []
                }
              />
            </div>
          </div>
        </div>
        <div>
          <Button size="sm" onClick={handleAddConfigProduct}>
            Add Config Product
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={configProducts.data ?? []}
        showPagination={false}
      />
    </Page>
  );
}
