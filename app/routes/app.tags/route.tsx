import { useEffect, useMemo, useState } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLocation, useNavigate } from "@remix-run/react";

import { authenticate } from "@/lib/shopify.server";
import Page from "@/components/ui/page";
import { Tabs } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "@/components/columns/index.columns";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function TagsTable() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const columns = useMemo(() => getColumns(), [pagination]);

  function handleAddConfigProduct() {
    navigate("/app/tags/create", {
      state: {
        activeTab: "tags",
        pagination,
      },
    });
  }

  useEffect(() => {
    if (state?.pagination) {
      setPagination(state.pagination);
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
                options={[
                  { label: "Filter Template", value: "filter-template" },
                  { label: "Filter Product", value: "filter-product" },
                ]}
              />
            </div>
          </div>
        </div>
        <div>
          <Button size="sm" onClick={handleAddConfigProduct}>
            Add Config Tag
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={[]} />
    </Page>
  );
}
