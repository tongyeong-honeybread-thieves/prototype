import {
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { districts, people } from "../data/mockData";
import type { Person, Risk } from "../types";
import { PersonRow } from "../components/people/PersonRow";
import { RiskBadge } from "../components/ui/RiskBadge";

export function PeoplePage({ onSelect, resolvedPersonIds, assignments }: { onSelect: (p: Person) => void; resolvedPersonIds: Set<number>; assignments: Record<number, string> }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Risk | "전체">("전체");
  const [district, setDistrict] = useState("전체 지역");
  const [view, setView] = useState<"list" | "grid">("list");
  const effectivePeople = useMemo(() => people.map(person => ({ ...person, manager: assignments[person.id] ?? person.manager, ...(resolvedPersonIds.has(person.id) ? { risk: "정상" as const } : {}) })), [assignments, resolvedPersonIds]);
  const shown = useMemo(
    () =>
      effectivePeople.filter(
        (p) =>
          (filter === "전체" || p.risk === filter) &&
          (district === "전체 지역" || p.district === district) &&
          (p.name.includes(query) || p.address.includes(query)),
      ),
    [filter, district, query, effectivePeople],
  );
  return (
    <div className="p-4 pb-24 sm:p-6 lg:p-8">
      <section className="card mb-5 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름 또는 주소로 검색"
              className="focus-ring h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm transition hover:border-slate-300"
            />
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="focus-ring h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-brand-300"
          >
            <option>전체 지역</option>
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <div className="flex gap-2 overflow-x-auto">
            {(["전체", "긴급", "주의", "관심", "정상"] as const).map((r) => (
              <button
                onClick={() => setFilter(r)}
                key={r}
                className={`focus-ring shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 active:translate-y-0 ${filter === r ? "bg-slate-900 text-white shadow-md" : "border border-slate-200 bg-white text-slate-500 hover:border-brand-200 hover:text-brand-700"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          검색 결과 <b className="text-slate-900">{shown.length}명</b>
        </p>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          <button
            onClick={() => setView("list")}
            aria-label="목록 보기"
            className={`rounded-md p-1.5 transition hover:bg-slate-100 ${view === "list" ? "bg-slate-100 text-brand-700" : "text-slate-400"}`}
          >
            <List size={17} />
          </button>
          <button
            onClick={() => setView("grid")}
            aria-label="카드 보기"
            className={`rounded-md p-1.5 transition hover:bg-slate-100 ${view === "grid" ? "bg-slate-100 text-brand-700" : "text-slate-400"}`}
          >
            <Grid2X2 size={17} />
          </button>
        </div>
      </div>
      {shown.length === 0 ? (
        <div className="card grid min-h-64 place-items-center p-8 text-center">
          <div>
            <UsersRound className="mx-auto text-slate-300" size={40} />
            <p className="mt-3 font-bold">조건에 맞는 대상자가 없어요</p>
            <button
              onClick={() => {
                setFilter("전체");
                setDistrict("전체 지역");
                setQuery("");
              }}
              className="mt-3 text-sm font-bold text-brand-700 hover:underline"
            >
              필터 초기화
            </button>
          </div>
        </div>
      ) : view === "list" ? (
        <div className="card divide-y divide-slate-100 p-2">
          {shown.map((p) => (
            <PersonRow key={p.id} person={p} onClick={() => onSelect(p)} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="card group p-5 text-left transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg active:translate-y-0"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 font-extrabold text-slate-600 transition group-hover:bg-brand-50 group-hover:text-brand-700">
                  {p.name.slice(-2)}
                </div>
                <RiskBadge risk={p.risk} />
              </div>
              <h3 className="mt-4 font-extrabold group-hover:text-brand-700">
                {p.name}{" "}
                <span className="text-xs font-medium text-slate-400">
                  {p.age}세
                </span>
              </h3>
              <p className="mt-1 text-xs text-slate-500">{p.address}</p>
              <p className="mt-4 line-clamp-2 text-sm text-slate-600">
                {p.reason}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="text-slate-400">담당 {p.manager} 복지사</span>
                <b>{p.lastActive}</b>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
