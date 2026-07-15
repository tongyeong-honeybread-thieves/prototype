import {
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  LayoutGrid,
  Maximize2,
  Search,
  SlidersHorizontal,
  UsersRound,
  Wifi,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { districts, people } from '../data/mockData'
import { useLiveMeasurements } from '../hooks/useLiveMeasurements'
import type { LivePowerPoint, Person, Risk } from '../types'

type GridSize = 4 | 9 | 16

const riskOrder: Record<Risk, number> = { 긴급: 0, 주의: 1, 관심: 2, 정상: 3 }

const riskColor: Record<Risk, string> = {
  긴급: '#e11d48',
  주의: '#ea580c',
  관심: '#d97706',
  정상: '#059669',
}

function PowerBars({ data, risk }: { data: LivePowerPoint[]; risk: Risk }) {
  const recent = data.slice(-20)
  const max = Math.max(...recent.map((point) => point.watts), 1)

  return (
    <div className="flex h-16 items-end gap-1 rounded-xl border border-slate-100 bg-slate-50 px-2.5 pb-2.5 pt-3 sm:h-[72px]">
      {recent.map((point, index) => (
        <span
          key={`${point.timestamp}-${index}`}
          className="min-h-1 flex-1 rounded-t-sm transition-[height] duration-500"
          style={{
            height: `${Math.max(7, (point.watts / max) * 100)}%`,
            backgroundColor: riskColor[risk],
            opacity: index === recent.length - 1 ? 1 : 0.58,
          }}
        />
      ))}
    </div>
  )
}

function MonitoringCard({
  person,
  data,
  watts,
  deviation,
  baseline,
  selected,
  onFocus,
  onDetail,
}: {
  person: Person
  data: LivePowerPoint[]
  watts: number
  deviation: number
  baseline: number
  selected: boolean
  onFocus: () => void
  onDetail: () => void
}) {
  return (
    <article
      id={`power-card-${person.id}`}
      onClick={onFocus}
      className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        selected ? 'border-brand-500 ring-2 ring-brand-100' : 'border-slate-200'
      }`}
    >
      <div className="h-1 w-full" style={{ backgroundColor: riskColor[person.risk] }} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-extrabold text-slate-600">
            {person.name.slice(-2)}
          </span>
          <div className="min-w-0">
            <b className="block truncate text-[15px] text-slate-900">{person.name}</b>
            <p className="mt-0.5 truncate text-[11px] text-slate-400">
              {person.district} · 2.8초 간격
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <b className="block text-xl font-extrabold leading-none tabular-nums text-slate-900">{watts.toFixed(1)}W</b>
          <p className={`mt-1.5 text-[11px] font-bold ${deviation < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {deviation > 0 ? '+' : ''}{deviation.toFixed(1)}%
          </p>
        </div>
        </div>

        <div className="mt-3 flex min-w-0 items-center justify-between gap-2">
          <span
            className="inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-[10px] font-extrabold text-white"
            style={{ backgroundColor: riskColor[person.risk] }}
          >
            {person.risk === '긴급' ? '긴급 · 즉시 확인' : person.risk}
          </span>
          <span className="truncate text-right text-[10px] text-slate-400">개인 기준 {baseline.toFixed(1)}W</span>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 pb-4 pt-3">
        <p className="mb-2 text-[11px] font-bold text-slate-600">최근 1분 전력 변화</p>
        <PowerBars data={data} risk={person.risk} />
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-[10px]">
        <span className="flex items-center gap-1 text-slate-400">
          <Wifi size={11} className="text-emerald-500" /> 실시간 수신 중
        </span>
        <button
          onClick={(event) => {
            event.stopPropagation()
            onDetail()
          }}
          className="rounded-lg px-2 py-1 font-bold text-brand-700 transition hover:bg-brand-50"
        >
          상세 확인
        </button>
      </div>
    </article>
  )
}

export function PowerMonitoringPage({
  onSelect,
  resolvedPersonIds,
}: {
  onSelect: (person: Person) => void
  resolvedPersonIds: Set<number>
}) {
  const { measurements, historyByPerson, lastUpdated } = useLiveMeasurements()
  const [query, setQuery] = useState('')
  const [risk, setRisk] = useState<Risk | '전체'>('전체')
  const [district, setDistrict] = useState('전체 지역')
  const [gridSize, setGridSize] = useState<GridSize>(9)
  const [page, setPage] = useState(0)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectorOpen, setSelectorOpen] = useState(false)
  const selectorRef = useRef<HTMLDivElement>(null)

  const effectivePeople = useMemo(
    () => people.map((person) => resolvedPersonIds.has(person.id) ? { ...person, risk: '정상' as const } : person),
    [resolvedPersonIds],
  )

  const filtered = useMemo(
    () => effectivePeople
      .filter((person) =>
        (risk === '전체' || person.risk === risk)
        && (district === '전체 지역' || person.district === district)
        && (person.name.includes(query) || person.address.includes(query)),
      )
      .sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk] || a.name.localeCompare(b.name)),
    [district, effectivePeople, query, risk],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / gridSize))
  const visible = filtered.slice(page * gridSize, (page + 1) * gridSize)

  useEffect(() => setPage((current) => Math.min(current, totalPages - 1)), [totalPages])

  useEffect(() => {
    if (!selectorOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectorOpen(false)
    }
    const closeOnOutside = (event: MouseEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) setSelectorOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('mousedown', closeOnOutside)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('mousedown', closeOnOutside)
    }
  }, [selectorOpen])

  const focusPerson = (person: Person) => {
    const index = filtered.findIndex((item) => item.id === person.id)
    if (index >= 0) setPage(Math.floor(index / gridSize))
    setSelectedId(person.id)
    setSelectorOpen(false)
    window.setTimeout(() => {
      document.getElementById(`power-card-${person.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
  }

  const selectorPanel = selectorOpen ? (
      <aside className="absolute left-0 top-[calc(100%+10px)] z-[200] flex max-h-[min(620px,calc(100dvh-170px))] w-[min(336px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
        <div className="border-b border-slate-100 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-slate-900">대상자 선택</h4>
              <p className="mt-1 text-xs text-slate-500">총 {filtered.length}명 · 위험도순</p>
            </div>
            <button
              onClick={() => setSelectorOpen(false)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="대상자 선택 닫기"
            >
              <X size={18} />
            </button>
          </div>
          <label className="relative mt-3 block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(0) }}
              placeholder="이름 또는 주소 검색"
              className="focus-ring h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs"
            />
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <select
              value={risk}
              onChange={(event) => { setRisk(event.target.value as Risk | '전체'); setPage(0) }}
              className="h-9 min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold"
            >
              <option>전체</option><option>긴급</option><option>주의</option><option>관심</option><option>정상</option>
            </select>
            <select
              value={district}
              onChange={(event) => { setDistrict(event.target.value); setPage(0) }}
              className="h-9 min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold"
            >
              <option>전체 지역</option>
              {districts.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-2">
          {filtered.map((person) => (
            <button
              key={person.id}
              onClick={() => focusPerson(person)}
              className={`mb-1 flex w-full items-center gap-2 rounded-xl p-2.5 text-left transition hover:bg-slate-50 ${
                selectedId === person.id ? 'bg-brand-50 ring-1 ring-inset ring-brand-200' : ''
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                {person.name.slice(-2)}
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate text-xs text-slate-800">{person.name}</b>
                <span className="block truncate text-[10px] text-slate-400">{person.district} · {person.lastActive}</span>
              </span>
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: riskColor[person.risk] }} />
            </button>
          ))}
        </div>
      </aside>
  ) : null

  return (
    <div className="p-4 pb-24 sm:p-6 lg:p-8">
      <main className="min-w-0">
          <div className="card relative z-20 mb-4 flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div ref={selectorRef} className="relative">
                <button
                  type="button"
                  aria-expanded={selectorOpen}
                  onClick={() => setSelectorOpen((current) => !current)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold shadow-sm transition ${selectorOpen ? 'bg-slate-900 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                >
                  <UsersRound size={15} /> 대상자 선택
                </button>
                {selectorPanel}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <SlidersHorizontal size={15} />
                <b className="text-slate-800">{filtered.length ? page * gridSize + 1 : 0}–{Math.min((page + 1) * gridSize, filtered.length)}</b>
                / {filtered.length}명
              </div>
            </div>
            <div className="ml-auto hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              LIVE · {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              {([
                { size: 4, icon: Grid2X2, label: '4분할' },
                { size: 9, icon: LayoutGrid, label: '9분할' },
                { size: 16, icon: Maximize2, label: '16분할' },
              ] as const).map(({ size, icon: Icon, label }) => (
                <button
                  key={size}
                  onClick={() => { setGridSize(size); setPage(0) }}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold transition ${
                    gridSize === size ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon size={14} /><span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {visible.length ? (
            <div className={`grid gap-3 ${
              gridSize === 4
                ? 'grid-cols-1 xl:grid-cols-2'
                : gridSize === 9
                  ? 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'
                  : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
            }`}>
              {visible.map((person) => {
                const measurement = measurements.find((item) => item.personId === person.id)
                if (!measurement) return null
                return (
                  <MonitoringCard
                    key={person.id}
                    person={person}
                    data={historyByPerson[person.id] ?? []}
                    watts={measurement.watts}
                    deviation={measurement.deviationPercent}
                    baseline={measurement.baselineWatts}
                    selected={selectedId === person.id}
                    onFocus={() => setSelectedId(person.id)}
                    onDetail={() => onSelect(person)}
                  />
                )
              })}
            </div>
          ) : (
            <div className="card grid min-h-72 place-items-center text-sm text-slate-400">조건에 맞는 대상자가 없습니다.</div>
          )}

          <div className="mt-4 flex items-center justify-center gap-3">
            <button disabled={page === 0} onClick={() => setPage((value) => value - 1)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 disabled:opacity-30">
              <ChevronLeft size={17} />
            </button>
            <span className="text-xs font-bold text-slate-500">{page + 1} / {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage((value) => value + 1)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 disabled:opacity-30">
              <ChevronRight size={17} />
            </button>
          </div>
      </main>
    </div>
  )
}
