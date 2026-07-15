import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  CircleCheck,
  Clock3,
  HeartPulse,
  MapPin,
  MapPinned,
  Phone,
  UserRound,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { powerChartData } from "../data/mockData";
import { riskStyle } from "../constants/ui";
import type { Person } from "../types";
import { RiskBadge } from "../components/ui/RiskBadge";
import { SafetyMap } from "../components/map/SafetyMap";

export function PersonDetailPage({
  person,
  onBack,
  isResolved,
  onResolve,
}: {
  person: Person;
  onBack: () => void;
  isResolved: boolean;
  onResolve: () => void;
}) {
  const [showLocation, setShowLocation] = useState(false);
  const [period, setPeriod] = useState<keyof typeof powerChartData>("day");
  return (
    <div className="p-4 pb-28 sm:p-6 lg:p-8">
      <button
        onClick={onBack}
        className="focus-ring group mb-4 flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-bold text-slate-500 transition hover:-translate-x-1 hover:bg-white hover:text-brand-700"
      >
        <ChevronLeft
          size={18}
          className="transition group-hover:-translate-x-0.5"
        />
        돌아가기
      </button>
      <section className="card overflow-hidden">
        <div className={`h-1.5 ${riskStyle[isResolved ? "정상" : person.risk].dot}`} />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="flex gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-slate-100 text-xl font-black text-slate-600">
                {person.name.slice(-2)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black">{person.name}</h3>
                  <RiskBadge risk={isResolved ? "정상" : person.risk} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {person.age}세 · {person.gender}성 · {person.district}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={13} />
                  {person.address}
                </p>
              </div>
            </div>
            <a
              href={`tel:${person.phone}`}
              className="focus-ring flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg active:translate-y-0"
            >
              <Phone size={17} />
              대상자에게 전화
            </a>
          </div>
          {!isResolved ? (
            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <AlertTriangle className="shrink-0 text-rose-600" size={20} />
                <div>
                  <b className="text-sm text-rose-900">안전 확인이 필요해요</b>
                  <p className="mt-0.5 text-xs text-rose-700">
                    {person.reason}
                  </p>
                </div>
              </div>
              <button
                onClick={onResolve}
                className="focus-ring shrink-0 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md active:translate-y-0"
              >
                정상 확인 · 처리 완료
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
              <CircleCheck size={20} />
              전화 확인을 완료했어요. 오늘 11:24 · {person.manager} 복지사
            </div>
          )}
        </div>
      </section>
      <section className="card mt-5 overflow-hidden">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><MapPinned size={20} /></div>
            <div><h3 className="font-extrabold">거주 위치</h3><p className="mt-0.5 text-xs text-slate-500">{person.address}</p></div>
          </div>
          <button onClick={() => setShowLocation(value => !value)} className="focus-ring rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:translate-y-0">
            {showLocation ? "지도 닫기" : "집 위치 확인하기"}
          </button>
        </div>
        {showLocation && <div className="h-[330px] border-t border-slate-100 sm:h-[420px]"><SafetyMap people={[person]} onSelect={() => undefined} focusedPersonId={person.id} showDetailAction={false} zoom={15} /></div>}
      </section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_.8fr]">
        <section className="card p-4 transition hover:shadow-lg sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-extrabold">오늘의 전력 사용</h3>
              <p className="mt-1 text-xs text-slate-500">
                평소 패턴과 오늘의 생활 전력 신호를 비교해요
              </p>
            </div>
            <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
              평소 대비 -74%
            </span>
          </div>
          <div className="mt-5 flex w-fit rounded-xl bg-slate-100 p-1">
            {([['day','일'],['week','주'],['month','월'],['year','년']] as const).map(([key,label]) => <button key={key} onClick={() => setPeriod(key)} className={`min-w-12 rounded-lg px-3 py-2 text-xs font-bold transition ${period===key?'bg-white text-brand-700 shadow-sm':'text-slate-500 hover:text-slate-800'}`}>{label}</button>)}
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerChartData[period]} margin={{ left: -20, right: 4 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="usual"
                  name="평소"
                  stroke="#94a3b8"
                  fill="#e2e8f0"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="today"
                  name="오늘"
                  stroke="#f43f5e"
                  fill="#ffe4e6"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <div className="space-y-5">
          <section className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="font-extrabold">대상자 정보</h3>
            <div className="mt-4 space-y-4 text-sm">
              <Info
                icon={<HeartPulse />}
                label="기저질환 및 특이사항"
                value={person.condition.join(" · ")}
              />
              <Info
                icon={<Clock3 />}
                label="마지막 연락"
                value={`${person.lastContactAt} · ${person.lastContactMethod}`}
                action={<p className="mt-1 text-xs font-medium text-emerald-700">{person.lastContactResult}</p>}
              />
              <Info
                icon={<UserRound />}
                label="보호자"
                value={`${person.guardian} (${person.guardianRelation})`}
                action={
                  <a
                    href={`tel:${person.guardianPhone}`}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {person.guardianPhone}
                  </a>
                }
              />
              <Info
                icon={<Wifi />}
                label="측정기 상태"
                value={`${person.meter} · 3분 전 수신`}
              />
            </div>
          </section>
          <section className="card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <h3 className="font-extrabold">담당자 메모</h3>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50 p-3 text-sm">
              <UserRound size={17} className="text-brand-600" />
              <span className="text-slate-500">담당 복지사</span>
              <b className="ml-auto text-brand-800">{person.manager}</b>
            </div>
            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              {person.note}
            </p>
          </section>
        </div>
      </div>
      <section className="card mt-5 p-5">
        <h3 className="font-extrabold">최근 활동</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              time: "오늘 06:00",
              title: "예상 기상 시간",
              desc: "생활 전력 활동이 감지되지 않음",
              icon: Clock3,
            },
            {
              time: "어제 21:42",
              title: "마지막 활동 감지",
              desc: "거실 전력 사용 추정",
              icon: Activity,
            },
            {
              time: "어제 16:10",
              title: "안부 확인 완료",
              desc: `${person.manager} 복지사 · 전화 확인`,
              icon: CircleCheck,
            },
          ].map(({ time, title, desc, icon: Icon }) => (
            <div
              className="group flex gap-3 rounded-xl p-2 transition hover:bg-slate-50"
              key={title}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-brand-50 group-hover:text-brand-700">
                <Icon size={17} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">{time}</p>
                <b className="text-sm">{title}</b>
                <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
function Info({
  icon,
  label,
  value,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 text-brand-600">
      {<span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>}
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-1 font-semibold text-slate-800">{value}</p>
        {action}
      </div>
    </div>
  );
}
