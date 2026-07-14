import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { SafetyMap } from "../components/map/SafetyMap";
import { PersonRow } from "../components/people/PersonRow";
import { districts, people } from "../data/mockData";
import type { Person, Risk } from "../types";

export function MapPage({ onSelect }: { onSelect: (p: Person) => void }) {
  const [risk, setRisk] = useState<Risk | "전체">("전체");
  const [district, setDistrict] = useState("전체 지역");
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState(true);
  const [focusedPersonId, setFocusedPersonId] = useState<number | null>(null);
  const shown = useMemo(
    () =>
      people.filter(
        (p) =>
          (risk === "전체" || p.risk === risk) &&
          (district === "전체 지역" || p.district === district) &&
          p.name.includes(query),
      ),
    [risk, district, query],
  );
  return (
    <div className="relative h-[calc(100dvh-136px)] min-h-[420px] overflow-hidden lg:h-[calc(100dvh-80px)] lg:min-h-[600px]">
      <SafetyMap
        people={shown}
        onSelect={onSelect}
        focusedPersonId={focusedPersonId}
        onMarkerFocus={(person) => setFocusedPersonId(person.id)}
      />
      <div className="absolute left-3 right-3 top-3 z-[500] flex gap-2 sm:left-5 sm:right-auto">
        <label className="relative flex-1 sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={17}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="지도에서 대상자 검색"
            className="focus-ring h-11 w-full rounded-xl border border-slate-200 bg-white/95 pl-10 pr-3 text-sm shadow-lg backdrop-blur"
          />
        </label>
        <button
          onClick={() => setPanel((v) => !v)}
          className="focus-ring rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-700 active:translate-y-0"
        >
          {shown.length}명
        </button>
      </div>
      {panel && (
        <aside className="absolute bottom-3 left-3 right-3 z-[500] max-h-[52%] overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur sm:bottom-5 sm:left-auto sm:right-5 sm:top-5 sm:max-h-none sm:w-[460px]">
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold">지도 대상자</h3>
                <p className="text-xs text-slate-500">
                  현재 조건에 {shown.length}명이 표시돼요
                </p>
              </div>
              <button
                onClick={() => setPanel(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {(["전체", "긴급", "주의", "관심", "정상"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRisk(r)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${risk === r ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-brand-50 hover:text-brand-700"}`}
                >
                  {r}
                </button>
              ))}
            </div>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-2 h-9 w-full rounded-lg border border-slate-200 px-2 text-xs font-semibold"
            >
              <option>전체 지역</option>
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="max-h-[calc(52dvh-145px)] divide-y divide-slate-100 overflow-y-auto overscroll-contain p-2 sm:max-h-[calc(100dvh-250px)]">
            {shown.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl transition-all ${focusedPersonId === p.id ? "bg-brand-50 ring-2 ring-inset ring-brand-500" : ""}`}
              >
                <PersonRow
                  person={p}
                  onClick={() => setFocusedPersonId(p.id)}
                  onDetails={() => onSelect(p)}
                />
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
