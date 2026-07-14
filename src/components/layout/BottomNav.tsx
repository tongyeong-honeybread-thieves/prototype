import { Bell, Home, Map, UsersRound } from "lucide-react";
import type { Page } from "../../types";
const items = [
  ["dashboard", "홈", Home],
  ["map", "지도", Map],
  ["people", "대상자", UsersRound],
  ["alerts", "알림", Bell],
] as const;
export function BottomNav({
  page,
  setPage,
  alertCount,
}: {
  page: Page;
  setPage: (p: Page) => void;
  alertCount: number;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1000] grid min-h-[72px] grid-cols-4 border-t border-slate-200 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:hidden">
      {items.map(([id, label, Icon]) => (
        <button
          key={id}
          onClick={() => setPage(id)}
          className={`focus-ring flex flex-col items-center gap-1 rounded-lg py-1 text-[10px] font-bold transition active:scale-90 ${page === id ? "text-brand-700" : "text-slate-400 hover:text-slate-700"}`}
        >
          <span
            className={`relative rounded-xl p-1 transition ${page === id ? "bg-brand-50 -translate-y-0.5" : ""}`}
          >
            <Icon size={20} />
            {id === "alerts" && alertCount > 0 && (
              <i className="absolute right-0 top-0 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
}
