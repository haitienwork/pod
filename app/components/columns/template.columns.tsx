import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Template } from "@prisma/client";
import { EditIcon, TrashIcon } from "../ui/icons";

interface ColumnsProps {
  handleDelete: (id: string) => void
  handleEdit: (id: string) => void
}

export const getColumns = (props: ColumnsProps): ColumnDef<Template>[] => {
  return [
    {
      accessorKey: "id",
      header: "Template Name",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 text-left font-medium">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              // onClick={handleClickStopPropagation}
            />
            <p>{row?.original?.name}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      size: 100,
      meta: {
        textAlign: 'justify-start'
      }
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
              size="sm"
              onClick={() => props.handleEdit(row.original.id)}
              // @ts-ignore
              variant="ghost"
            >
              <EditIcon />
            </Button>
            <Button
              size="sm"
              onClick={() => props.handleDelete(row.original.id)}
              // @ts-ignore
              variant="ghost"
              className='text-destructive'
            >
              <TrashIcon />
            </Button>
          </div>
        );
      },
    },
  ];
};
