import { Activity, Radio, TrendingDown, Wifi } from 'lucide-react'
import { useMemo } from 'react'
import { people } from '../../data/mockData'
import { useLiveMeasurements } from '../../hooks/useLiveMeasurements'
import type { Person, Risk } from '../../types'
import { RiskBadge } from '../ui/RiskBadge'

const priority: Record<Risk, number> = { 긴급: 0, 주의: 1, 관심: 2, 정상: 3 }

export function LiveSignalPanel({ onSelect }: { onSelect: (person: Person) => void }) {
  const { measurements, lastUpdated } = useLiveMeasurements()
  const visible = useMemo(() => measurements.map(measurement => ({ measurement, person: people.find(person => person.id === measurement.personId)! })).filter(item => item.person.risk !== '정상').sort((a, b) => priority[a.person.risk] - priority[b.person.risk] || Math.abs(b.measurement.deviationPercent) - Math.abs(a.measurement.deviationPercent)).slice(0, 6), [measurements])
  const time = lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return <section className="card overflow-hidden">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-3"><span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700"><Radio size={18}/><i className="absolute inset-0 animate-ping rounded-xl border border-brand-400 opacity-30"/></span><div><h3 className="font-extrabold">실시간 이상 신호</h3><p className="mt-0.5 text-xs text-slate-500">개인별 평소 기준 대비 편차가 큰 대상자 순서예요</p></div></div><div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"/>LIVE · {time}</div></div>
    <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-3">{visible.map(({measurement:item,person})=><button key={person.id} onClick={()=>onSelect(person)} className={`group bg-white p-4 text-left transition-all duration-500 hover:z-10 hover:bg-slate-50 ${item.changed?'ring-1 ring-inset ring-brand-200':''}`}><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="relative grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-extrabold text-slate-600">{person.name.slice(-2)}<i className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500"/></span><div><b className="text-sm group-hover:text-brand-700">{person.name}</b><p className="text-[10px] text-slate-400">{person.district}</p></div></div><RiskBadge risk={person.risk}/></div><div className="mt-3 flex items-end justify-between"><div><p className="text-2xl font-black tracking-tight tabular-nums">{item.watts}<span className="ml-1 text-xs font-bold text-slate-400">W</span></p><p className="mt-1 text-[11px] text-slate-500">평소 기준 {item.baselineWatts}W</p></div><span className="flex items-center text-sm font-black text-rose-600"><TrendingDown size={15}/>{item.deviationPercent}%</span></div><p className="mt-3 flex items-start gap-1.5 border-t border-slate-100 pt-3 text-[11px] leading-4 text-slate-600"><Activity size={12} className="mt-0.5 shrink-0"/>{item.reason}</p></button>)}</div>
    <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-[10px] text-slate-500"><Wifi size={12}/>프로토타입 규칙: 개인 평소 기준 대비 20% 이상 편차가 발생한 대상을 표시합니다.</div>
  </section>
}
