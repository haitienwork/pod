import { NotFoundSvg } from "@/components/ui/icons/404-svg";
import stylesheet from "@/styles/tailwind.css?url";
import { Link } from "@remix-run/react";
import { buttonVariants } from "@/components/ui/button";

export const links = () => [{ rel: "stylesheet", href: stylesheet }];

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <NotFoundSvg className="w-auto max-w-[16rem] h-40 text-gray-800 dark:text-white" />
      <p className="text-2xl font-bold">Page not found</p>
      <Link to="/app" className={buttonVariants({ variant: "default" })}>
        Go to home
      </Link>
    </div>
  );
};

export default NotFoundPage;
