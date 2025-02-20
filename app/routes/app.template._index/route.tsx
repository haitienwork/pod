import { useMemo } from "react";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

import { authenticate } from "@/lib/shopify.server";
import Page from "@/components/ui/page";
import { Tabs } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "@/components/columns/template.columns";
import { BACKEND_URL } from "@/config/app.config";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10");

  // Get templates with pagination and counts
  const res = await fetch(
    `${BACKEND_URL}/template?page=${page}&pageSize=${pageSize}`,
  );
  const templates = await res.json();

  // Get total count
  return {
    data: templates as { data: any[]; total: number },
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");

  if (action === "delete") {
    const id = formData.get("id") as string;
    await fetch(`${BACKEND_URL}/template/${id}`, { method: "DELETE" });
    return { success: true };
  }

  return null;
};

export default function TemplateTables() {
  const { data } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentPageSize = parseInt(searchParams.get("pageSize") || "10");
  const navigate = useNavigate();

  function handleAddTemplate() {
    navigate("/app/template/add", {
      state: {
        activeTab: "template",
        pagination: {
          pageIndex: currentPage,
          pageSize: currentPageSize,
        },
      },
    });
  }

  const handleDelete = (id: string) => {
    fetcher.submit({ id, _action: "delete" }, { method: "POST" });
  };

  const handleEdit = (id: string) => {
    navigate(`/app/template/${id}`, {
      state: {
        currentTab: "template",
        pagination: {
          pageIndex: currentPage,
          pageSize: currentPageSize,
        },
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const handlePageSizeChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("pageSize", value);
      prev.set("page", "1");
      return prev;
    });
  };

  const columns = useMemo(
    () => getColumns({ handleDelete, handleEdit }),
    [data],
  );

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
                options={[
                  { label: "Filter Template", value: "filter-template" },
                  { label: "Filter Product", value: "filter-product" },
                ]}
              />
            </div>
          </div>
        </div>
        <div>
          <Button size="sm" onClick={handleAddTemplate}>
            Add Template
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data.data as any} />
    </Page>
  );
}
