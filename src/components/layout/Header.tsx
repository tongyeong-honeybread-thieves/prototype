import { Bell, Menu } from "lucide-react";
export function Header({
  title,
  onMenu,
  onAlerts,
  alertCount,
}: {
  title: string;
  onMenu: () => void;
  onAlerts: () => void;
  alertCount: number;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:h-20 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="focus-ring rounded-xl border border-slate-200 p-2.5 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 active:scale-95 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">
            {title}
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            담당 대상자의 생활 신호를 한눈에 확인하세요
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          시스템 정상
        </span>
        <button
          onClick={onAlerts}
          aria-label="알림 보기"
          className="focus-ring group relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 hover:shadow-md active:translate-y-0"
        >
          <Bell size={19} className="group-hover:rotate-6" />
          {alertCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />}
        </button>
      </div>
    </header>
  );
}
