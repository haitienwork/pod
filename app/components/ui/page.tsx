import { Link, useLocation, useNavigate } from "@remix-run/react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";

type PageWithFooter = {
  showFooter: boolean;
  idForm: string;
  isLoading: boolean;
};

type PageWithoutFooter = {
  showFooter?: never;
  idForm?: never;
  isLoading?: never;
};

type PageProps = {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
} & (PageWithFooter | PageWithoutFooter);

function Page(props: PageProps) {
  const { state } = useLocation();
  const navigate = useNavigate();

  function handleBack() {
    if (props.backHref) {
      navigate(props.backHref, {
        state,
      });
    }
  }

  return (
    <Card>
      {(props.title || props.backHref) && (
        <CardHeader className="flex gap-2 items-center flex-row border-b pb-2">
          {props.backHref && (
            <Link to={props.backHref} className="flex items-center gap-2">
              <Button
                // @ts-ignore
                variant={"outline"}
                size="icon"
                className="!size-8"
                onClick={handleBack}
              >
                <ChevronLeft />
              </Button>
            </Link>
          )}
          <CardTitle className="!mt-0 text-lg tracking-normal">
            {props.title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={props.title ? "mt-4 space-y-4" : "space-y-4"}>
        {props.children}
      </CardContent>
      {props.showFooter && (
        <CardFooter className="justify-end gap-2 mt-4">
          {/* @ts-ignore */}
          <Button onClick={handleBack} variant={"outline"} size="sm">
            Cancel
          </Button>
          <Button type='submit' form={props.idForm} size="sm" loading={props.isLoading}>
            Save
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default Page;
