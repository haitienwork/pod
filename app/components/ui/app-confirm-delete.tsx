import { DialogClose } from "@radix-ui/react-dialog";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

import { Button } from "./button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AppConfirmDeleteProps {
  children?: React.ReactNode | string;
  title?: string;
  subTitle?: string;
  open?: boolean;
  onOpenChange?: React.Dispatch<React.SetStateAction<any>>;
  onDelete?: () => Promise<void> | (() => void);
  isLoading?: boolean;
}
export const AppConfirmDelete: React.FC<AppConfirmDeleteProps> = ({
  children,
  title = "Confirm Delete",
  subTitle = "Are you sure you want to delete?",
  open,
  onOpenChange = () => {},
  onDelete = async () => {},
  isLoading = false,
}) => {
  async function handleDelete() {
    await onDelete?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subTitle}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose className="border-0 outline-none">
            {/* @ts-ignore */}
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose className="border-0 outline-none">
            <Button
              onClick={handleDelete}
              className="bg-primary-main hover:bg-primary-main hover:opacity-80"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "OK"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
