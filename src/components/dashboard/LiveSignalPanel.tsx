import { Activity, Clock3, Radio, TrendingDown, Wifi } from "lucide-react";
import { useMemo } from "react";
import { people } from "../../data/mockData";
import { useLiveMeasurements } from "../../hooks/useLiveMeasurements";
import type { Person, Risk } from "../../types";
import { RiskBadge } from "../ui/RiskBadge";
import { VitalPowerChart } from "./VitalPowerChart";

export function LiveSignalPanel({
  onSelect,
  resolvedPersonIds,
}: {
  onSelect: (person: Person) => void;
  resolvedPersonIds: Set<number>;
}) {
  const { measurements, historyByPerson, lastUpdated } = useLiveMeasurements();
  const selected = useMemo(() => {
    const available = people.filter(
      (person) => !resolvedPersonIds.has(person.id),
    );
    return [
      ...available.filter((person) => person.risk === "긴급").slice(0, 2),
      ...available.filter((person) => person.risk === "주의").slice(0, 1),
      ...available.filter((person) => person.risk === "정상").slice(0, 1),
    ];
  }, [resolvedPersonIds]);
  const time = lastUpdated.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <section className="card overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <Radio size={19} />
            <i className="absolute inset-0 animate-ping rounded-xl border border-brand-400 opacity-25" />
          </span>
          <div>
            <h3 className="font-extrabold">실시간 전력 모니터링</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              긴급 대상자 중심 · 최근 1분 측정 흐름
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          LIVE · {time}
        </div>
      </header>
      <div className="grid gap-px bg-slate-200 lg:grid-cols-2">
        {selected.map((person) => {
          const measurement = measurements.find(
            (item) => item.personId === person.id,
          )!;
          const history = historyByPerson[person.id] ?? [];
          const lower = Math.round(measurement.baselineWatts * 0.85 * 10) / 10;
          const upper = Math.round(measurement.baselineWatts * 1.15 * 10) / 10;
          const values = [...history.map((point) => point.watts), lower, upper];
          const min = Math.max(0, Math.floor(Math.min(...values) * 0.85));
          const max = Math.ceil(Math.max(...values) * 1.12);
          return (
            <article
              key={person.id}
              className={`bg-white p-4 sm:p-5 ${person.risk === "긴급" ? "border-l-4 border-rose-500" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => onSelect(person)}
                  className="flex min-w-0 items-center gap-3 text-left group"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-extrabold text-slate-600 group-hover:bg-brand-50">
                    {person.name.slice(-2)}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <b className="truncate text-sm group-hover:text-brand-700">
                        {person.name}
                      </b>
                      <RiskBadge risk={person.risk} />
                    </span>
                    <span className="mt-1 block text-[11px] text-slate-400">
                      {person.district} · 2.8초 간격
                    </span>
                  </span>
                </button>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-black tabular-nums">
                    {measurement.watts.toFixed(1)}
                    <span className="ml-1 text-xs text-slate-400">W</span>
                  </p>
                  <p
                    className={`mt-1 flex items-center justify-end gap-1 text-xs font-bold ${measurement.deviationPercent < 0 ? "text-rose-600" : "text-emerald-600"}`}
                  >
                    <TrendingDown size={13} />
                    {measurement.deviationPercent.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <VitalPowerChart
                  data={history}
                  risk={person.risk}
                  baselineWatts={measurement.baselineWatts}
                  inactiveHours={person.inactiveHours}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px]">
                <span className="flex items-center gap-1 text-slate-500">
                  <Activity size={12} />
                  {measurement.reason}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-500">
                  <Clock3 size={12} />
                  {person.risk === "긴급"
                    ? `${person.inactiveHours}시간 저전력 지속`
                    : `평소 ${lower.toFixed(1)}~${upper.toFixed(1)}W`}
                </span>
              </div>
            </article>
          );
        })}
      </div>
      <footer className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-[10px] text-slate-500">
        <Wifi size={12} />
        시연용 실시간 스트림 · 개인별 평소 범위와 현재 측정값을 비교합니다.
      </footer>
    </section>
  );
}
