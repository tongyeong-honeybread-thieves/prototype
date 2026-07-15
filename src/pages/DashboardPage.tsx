import { AlertTriangle, CircleCheck, Siren, UsersRound } from "lucide-react";
import { people } from "../data/mockData";
import type { Page, Person, Risk } from "../types";
import { riskStyle } from "../constants/ui";
import { SafetyMap } from "../components/map/SafetyMap";
import { PersonRow } from "../components/people/PersonRow";
import { PowerSummaryCard } from "../components/dashboard/PowerSummaryCard";
import { EmergencyTestModal } from "../components/alerts/EmergencyTestModal";
import { motion } from "framer-motion";
import { useEffect } from "react";

let hasPlayedDashboardIntro = false;
const introContainer = { hidden: {}, show: { transition: { staggerChildren: .12, delayChildren: .06 } } };
const introItem = { hidden: { opacity: 0, y: -34 }, show: { opacity: 1, y: 0, transition: { duration: .52, ease: [0.22, 1, 0.36, 1] as const } } };

export function DashboardPage({
  onSelect,
  setPage,
  resolvedPersonIds,
}: {
  onSelect: (p: Person) => void;
  setPage: (p: Page) => void;
  resolvedPersonIds: Set<number>;
}) {
  const playIntro = !hasPlayedDashboardIntro;
  useEffect(() => { hasPlayedDashboardIntro = true; }, []);
  const stats = [
    {
      label: "담당 대상자",
      value: "48",
      unit: "명",
      icon: UsersRound,
      tone: "text-blue-600 bg-blue-50",
      delta: "전체 인원",
    },
    {
      label: "긴급 확인",
      value: "2",
      unit: "명",
      icon: Siren,
      tone: "text-rose-600 bg-rose-50",
      delta: "즉시 확인 필요",
    },
    {
      label: "주의 대상",
      value: "5",
      unit: "명",
      icon: AlertTriangle,
      tone: "text-orange-600 bg-orange-50",
      delta: "전일 대비 +2",
    },
    {
      label: "오늘 확인 완료",
      value: "16",
      unit: "건",
      icon: CircleCheck,
      tone: "text-brand-600 bg-brand-50",
      delta: "진행률 67%",
    },
  ];
  const dashboardPeople = people.map(person => resolvedPersonIds.has(person.id) ? { ...person, risk: "정상" as const } : person);
  const priorityPeople = dashboardPeople.filter(person => person.risk !== "정상").slice(0, 5);
  stats[1].value = String(dashboardPeople.filter(person => person.risk === "긴급").length);
  stats[2].value = String(dashboardPeople.filter(person => person.risk === "주의").length);
  stats[3].value = String(16 + resolvedPersonIds.size);
  return (
    <motion.div initial={playIntro ? "hidden" : false} animate="show" variants={introContainer} className="space-y-5 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
      <motion.section variants={introItem} className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">2026년 7월 15일 수요일</p>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight">
            창원시 생활안전 관리 현황
          </h3>
        </div>
        <p className="text-sm font-medium text-slate-500">
          <span className="font-bold text-rose-600">긴급 대상자 {stats[1].value}명</span>의
          확인이 필요해요.
        </p>
      </motion.section>
      <motion.div variants={introItem} className="flex justify-end"><EmergencyTestModal person={people[0]} onDetails={() => onSelect(people[0])} /></motion.div>
      <motion.section variants={introItem} className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map(({ label, value, unit, icon: Icon, tone, delta }) => (
          <button
            onClick={() =>
              label === "담당 대상자"
                ? setPage("people")
                : label === "오늘 확인 완료"
                  ? setPage("alerts")
                  : setPage("alerts")
            }
            className="card group p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg active:translate-y-0 sm:p-5"
            key={label}
          >
            <div className="flex items-center justify-between">
              <div
                className={`grid h-9 w-9 place-items-center rounded-xl transition-transform group-hover:scale-110 group-hover:rotate-3 sm:h-10 sm:w-10 ${tone}`}
              >
                <Icon size={19} />
              </div>
              <span className="hidden text-[11px] font-semibold text-slate-400 sm:block">
                {delta}
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold text-slate-500 sm:text-sm">
              {label}
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              {value}
              <span className="ml-1 text-sm font-semibold text-slate-400">
                {unit}
              </span>
            </p>
          </button>
        ))}
      </motion.section>
      <motion.section variants={introItem} className="grid gap-5 xl:grid-cols-[1.45fr_.85fr]">
        <div className="card overflow-hidden transition hover:shadow-lg">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <h3 className="font-extrabold">창원시 생활안전 지도</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                마커를 눌러 대상자의 상태를 확인하세요
              </p>
            </div>
            <button
              onClick={() => setPage("map")}
              className="rounded-lg px-2 py-1 text-xs font-bold text-brand-700 transition hover:bg-brand-50"
            >
              전체 보기 →
            </button>
          </div>
          <div className="h-[320px] sm:h-[390px]">
            <SafetyMap
              people={dashboardPeople}
              onSelect={onSelect}
              interactive
              zoom={11}
            />
          </div>
          <div className="flex flex-wrap gap-4 px-5 py-3 text-[11px] text-slate-500">
            {(["긴급", "주의", "관심", "정상"] as Risk[]).map((r) => (
              <span key={r} className="flex items-center gap-1.5">
                <i className={`h-2 w-2 rounded-full ${riskStyle[r].dot}`} />
                {r}
              </span>
            ))}
          </div>
        </div>
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="font-extrabold">우선 확인 대상자</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                위험도가 높은 순서예요
              </p>
            </div>
            <button
              onClick={() => setPage("people")}
              className="rounded-lg px-2 py-1 text-xs font-bold text-brand-700 transition hover:bg-brand-50"
            >
              전체 보기 →
            </button>
          </div>
          <div className="divide-y divide-slate-100 p-2">
            {priorityPeople.map((p) => (
              <PersonRow key={p.id} person={p} onClick={() => onSelect(p)} />
            ))}
          </div>
        </div>
      </motion.section>
      <motion.button variants={introItem}
        onClick={() => setPage("people")}
        className="card group w-full p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold group-hover:text-brand-700">
              오늘의 확인 현황
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              담당 대상자 48명 중 {32 + resolvedPersonIds.size}명의 생활 신호가 확인됐어요
            </p>
          </div>
          <b className="text-brand-700">{Math.round((32 + resolvedPersonIds.size) / 48 * 100)}%</b>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-500 transition-all duration-500 group-hover:bg-brand-600" style={{ width: `${Math.min(100, Math.round((32 + resolvedPersonIds.size) / 48 * 100))}%` }} />
        </div>
      </motion.button>
      <motion.div variants={introItem}><PowerSummaryCard onSelect={onSelect} setPage={setPage} resolvedPersonIds={resolvedPersonIds} /></motion.div>
    </motion.div>
  );
}
