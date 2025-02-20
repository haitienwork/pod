import { Link } from "@remix-run/react";
import { Button } from "./button";
import { ExitIcon } from "./icons";

interface LayoutProps {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  title?: string;
}

export function Layout(props: LayoutProps) {
  return (
    <section id="main-page" className="font-man">
      {/* Back button */}
      {props.backHref && (
        <div className="h-14 flex border-b pr-4">
          <Link to={props.backHref} className="flex items-center gap-2">
            {/* @ts-ignore */}
            <Button variant={"ghost"} icon={ExitIcon} iconPlacement="left">
              {props.backLabel ?? "Back"}
            </Button>
          </Link>
        </div>
      )}
      <div className="p-4 space-y-4">
        {props.title && (
          <h1 className="text-xl font-bold">{props.title}</h1>
        )}
        {props.children}
      </div>
    </section>
  );
}

