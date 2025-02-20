import {
  type ColumnDef,
  Row,
  type RowData,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type React from "react";
import { useState } from "react";

import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Pagination } from ".";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onClickEmpty?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickRow?: (row: Row<TData>) => void;
  isLoading?: boolean;
  showPagination?: boolean;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination?: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  pageSize?: number;
}
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    textAlign: "justify-start" | "justify-center" | "justify-end";
  }
}
type ColumnSort = {
  id: string;
  desc: boolean;
};
type SortingState = ColumnSort[];

export function DataTable<TData, TValue>({
  columns,
  data,
  onClickRow,
  isLoading,
  showPagination = true,
  pagination = {
    pageIndex: 0,
    pageSize: 10,
  },
  setPagination = () => {},
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "id",
      desc: false,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (updaterOrValue) => {
      setPagination(updaterOrValue as { pageIndex: number; pageSize: number });
    },
    autoResetPageIndex: false,
    state: {
      pagination,
      sorting,
    },
    manualPagination: true,
    onSortingChange: setSorting,
  });

  return (
    <div className="">
      <Table>
        <TableHeader className="sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-neutral-3 bg-neutral-50"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="px-3 py-3">
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyUp={header.column.getToggleSortingHandler()}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer hover:opacity-80",
                        header.column.columnDef?.meta?.textAlign
                          ? header.column.columnDef?.meta?.textAlign
                          : "",
                      )}
                    >
                      <p className="typo-s14-w700 text-neutral-600">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </p>
                      <span>
                        {{
                          asc: <ArrowUpWideNarrow className="w-4 h-4" />,
                          desc: <ArrowDownWideNarrow className="w-4 h-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-neutral-3">
                {headerGroup.headers.map((item) => {
                  return (
                    <TableCell key={item?.index}>
                      <Skeleton className="w-full h-[30px] rounded-full" />
                      <Skeleton className="w-full h-[30px] rounded-full mt-5" />
                      <Skeleton className="w-full h-[30px] rounded-full mt-5" />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-neutral-3 cursor-pointer"
                    onClick={() => {
                      if (onClickRow) {
                        onClickRow(row);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        width={cell.column.columnDef?.size}
                        className="py-3 px-3"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[50vh] text-center"
                  >
                    <div className="flex-center flex-col">
                      <img
                        src="/images/empty-data.png"
                        alt=""
                        className="mx-auto w-[100px] text-center"
                      />
                      <p className="py-4"> No data</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
      {showPagination ? (
        <Pagination
          count={data?.length}
          page={pagination?.pageIndex + 1}
          limit={pagination?.pageSize}
          onChangeLimit={(e) => {
            setPagination({ pageIndex: 0, pageSize: e });
          }}
          disabledNextPage={!table.getCanNextPage()}
          disabledPreviousPage={!table.getCanPreviousPage()}
          onNextPage={() => {
            table.nextPage();
          }}
          onPreviousPage={() => {
            table.previousPage();
          }}
          onChangeGotoPage={(page) => {
            table.setPageIndex(page - 1);
          }}
        />
      ) : null}
    </div>
  );
}
