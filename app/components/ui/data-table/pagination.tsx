import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { addZeroString } from "@/lib/utils";
import debounce from "lodash.debounce";
import { listPagination } from ".";

interface IProps {
  count?: number;
  page?: number;
  limit?: number;
  onChangePage?: (page: number) => void;
  onChangeLimit?: (item: number) => void;
  disabledNextPage?: boolean;
  disabledPreviousPage?: boolean;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onChangeGotoPage?: (item: number) => void;
}
export const Pagination: React.FC<IProps> = ({
  page = 1,
  limit = 0,
  count = 0,
  onChangeLimit,
  disabledNextPage = false,
  disabledPreviousPage = false,
  onPreviousPage,
  onNextPage,
  onChangeGotoPage,
}) => {
  const [valueChangeGotoPage, SetValueChangeGotoPage] = useState<
    number | string
  >(page);
  const debounceOnChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        e.target.value !== "" &&
        Number(e.target.value) - 1 < Math.ceil(Number(count / limit)) &&
        onChangeGotoPage
      ) {
        onChangeGotoPage(Number(e.target.value) - 1);
      }
    },
    700,
  );

  return (
    <>
      <div className="flex justify-between rounded-b-lg border-t border-neutral-100 pt-2 sticky bottom-0 bg-background">
        <div className="flex items-center">
          <p className="text-muted-foreground text-sm">
            Showing {addZeroString((page - 1) * limit + 1)} -{" "}
            {addZeroString(limit * page)} of {addZeroString(count)} Results
          </p>
        </div>
        <div className="flex items-center justify-end gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                // @ts-ignore
                variant="outline"
                className="h-[40px] w-[80px] rounded-lg text-neutral-800 hover:bg-neutral-100 focus-visible:ring-transparent"
              >
                {limit}
                <ChevronDown className="ml-auto h-4 w-4 text-neutral-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[80px]">
              {listPagination?.map((item, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={item === limit}
                  onClick={() => {
                    onChangeLimit?.(item);
                  }}
                >
                  {item}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <ChevronLeft
            className={cn(
              "size-4",
              disabledPreviousPage
                ? "pointer-events-none cursor-not-allowed text-muted-foreground"
                : "cursor-pointer",
            )}
            onClick={onPreviousPage}
          />
          <p className="text-sm text-muted-foreground text-nowrap">
            Page {page} of {Math.ceil(Number(count / limit))}
          </p>
          <ChevronRight
            className={cn(
              "size-4",
              disabledNextPage
                ? "pointer-events-none cursor-not-allowed text-muted-foreground"
                : "cursor-pointer",
            )}
            onClick={onNextPage}
          />
          <p className="text-sm text-neutral-500 text-nowrap">Go to</p>
          <div>
            <Input
              value={valueChangeGotoPage}
              className="h-[36px] w-[49px] text-center text-neutral-800"
              onChange={(event) => {
                debounceOnChange(event);
                SetValueChangeGotoPage(event.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
