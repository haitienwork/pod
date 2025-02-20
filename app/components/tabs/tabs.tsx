import { useLocation, useNavigate } from "@remix-run/react";
import { TABS } from ".";
import { cn } from "@/lib/utils";
import { useCallback, useMemo } from "react";

export function Tabs() {
  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const currentTab = useMemo(() => {
    let _tab = state?.activeTab
    if(!_tab && pathname !== '/app') {
      _tab = pathname.split('/')[2]
    }
    return _tab ?? "app";
  }, [state]);

  const handleTabChange = useCallback(
    (tab: string) => {
      if (tab === currentTab) return;

      if (tab === "app") {
        return navigate("/app", {
          state: {
            activeTab: "app",
          },
        });
      }

      navigate(`/app/${tab}`, {
        state: {
          activeTab: tab,
        },
      });
    },
    [navigate],
  );

  return (
    <div className="border-b flex gap-2 flex-wrap">
      {TABS.map((item) => (
        <button
          key={item.value}
          className={cn(
            "text-sm px-2 py-2 border-b-2 border-transparent text-neutral-500 hover:text-primary hover:border-primary transition-colors text-nowrap",
            currentTab === item.value &&
              "border-primary text-primary font-semibold",
          )}
          onClick={() => handleTabChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
