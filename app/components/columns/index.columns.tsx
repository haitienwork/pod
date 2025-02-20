import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { EditIcon, TrashIcon } from "../ui/icons";

export const getColumns = ({
  template,
  handleEditConfigProduct,
}: {
  template: any[];
  handleEditConfigProduct: (id: string) => void;
}): ColumnDef<any>[] => {
  return [
    {
      accessorKey: "id",
      header: ({ table }) => (
        <div className="text-left flex items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            // onClick={handleClickStopPropagation}
            aria-label="Select all"
            className="mr-4"
          />
          Configured Product Name
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-left font-medium">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              // onClick={handleClickStopPropagation}
            />
            <img
              src={row?.original?.img}
              alt={row?.original?.name}
              className="aspect-[9/16] w-6 rounded-lg"
            />
            <p>{row?.original?.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "totalInventory",
      header: "Product Quantity",
      size: 100,
    },
    {
      accessorKey: "template",
      header: "Template",
      size: 220,
      meta: {
        textAlign: "justify-center",
      },
      cell: ({ row }) => {
        const templateFound = template.find(
          (t) => t.id === row.original.templateId,
        );
        return (
          <span className="text-sm text-center px-1.5 py-1 inline-block bg-muted rounded-md">
            {templateFound?.name}
          </span>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      meta: {
        textAlign: "justify-end",
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end">
            <Button
              size="icon"
              onClick={() => handleEditConfigProduct(row.original.id)}
              // @ts-ignore
              variant="ghost"
            >
              <EditIcon />
            </Button>
            <Button
              size="icon"
              // @ts-ignore
              variant="ghost"
              className="text-destructive"
            >
              <TrashIcon />
            </Button>
          </div>
        );
      },
    },
  ];
};
