import {
  Activity,
  Bell,
  LayoutDashboard,
  Map,
  ShieldCheck,
  UserCog,
  UsersRound,
  X,
} from "lucide-react";
import type { Page } from "../../types";

const items = [
  { id: "dashboard" as Page, label: "대시보드", icon: LayoutDashboard },
  { id: "map" as Page, label: "지도 모니터링", icon: Map },
  { id: "power" as Page, label: "전력 모니터링", icon: Activity },
  { id: "people" as Page, label: "대상자 관리", icon: UsersRound },
  { id: "assignments" as Page, label: "담당자 배정", icon: UserCog },
  { id: "alerts" as Page, label: "이상 징후·알림", icon: Bell },
];
export function Sidebar({
  page,
  setPage,
  open,
  close,
  alertCount,
}: {
  page: Page;
  setPage: (p: Page) => void;
  open: boolean;
  close: () => void;
  alertCount: number;
}) {
  return (
    <>
      {open && (
        <button
          aria-label="메뉴 닫기"
          onClick={close}
          className="fixed inset-0 z-[1900] bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-[2000] flex w-[270px] flex-col border-r border-slate-200 bg-white px-4 py-5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl transition-transform lg:z-50 lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-2">
          <button
            onClick={() => setPage("dashboard")}
            className="group flex items-center gap-3 text-left"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_8px_20px_rgba(5,150,105,0.22)] transition group-hover:-rotate-3 group-hover:scale-105">
              <ShieldCheck size={25} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h1 className="brand-wordmark text-[26px] font-black leading-none text-slate-900 transition group-hover:text-brand-700">
                하루결
              </h1>
              <p className="mt-1.5 whitespace-nowrap text-[9px] font-medium tracking-[-0.01em] text-slate-400">
                매일의 생활 흔적을 이어 안전으로
              </p>
            </div>
          </button>
          <button
            onClick={close}
            className="focus-ring rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="mt-9 space-y-1">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setPage(id);
                close();
              }}
              className={`focus-ring group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${page === id ? "bg-brand-50 text-brand-700 shadow-sm" : "text-slate-500 hover:translate-x-1 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              <Icon
                size={19}
                className="transition-transform group-hover:scale-110"
              />
              {label}
              {id === "alerts" && alertCount > 0 && (
                <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] text-white">
                  {alertCount}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white transition hover:-translate-y-1 hover:shadow-lg">
          <div className="mb-3 flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 font-bold">
              복
            </div>
            <div>
              <p className="text-sm font-bold">창원시 생활안전센터</p>
              <p className="text-xs text-slate-400">기관 관리자</p>
            </div>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-xs">
            <span className="text-slate-400">관리 대상자</span>
            <b>48명</b>
          </div>
        </div>
      </aside>
    </>
  );
}
