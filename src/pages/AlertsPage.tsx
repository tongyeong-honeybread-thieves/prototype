import { AlertTriangle, CheckCircle2, Clock3, Filter, Siren } from 'lucide-react'
import { useMemo, useState } from 'react'
import { alerts, people } from '../data/mockData'
import { riskStyle } from '../constants/ui'
import type { AlertStatus, Person } from '../types'
import { RiskBadge } from '../components/ui/RiskBadge'

interface AlertsPageProps {
  onSelect: (person: Person) => void
  resolvedPersonIds: Set<number>
  onResolve: (personId: number) => void
}

export function AlertsPage({ onSelect, resolvedPersonIds, onResolve }: AlertsPageProps) {
  const [filter, setFilter] = useState<AlertStatus | '전체'>('전체')
  const [localStatus, setLocalStatus] = useState<Record<number, AlertStatus>>({})
  const getStatus = (alertId: number, personId: number, fallback: AlertStatus): AlertStatus => resolvedPersonIds.has(personId) ? '완료' : (localStatus[alertId] ?? fallback)
  const shown = useMemo(() => alerts.filter(alert => filter === '전체' || getStatus(alert.id, alert.personId, alert.status) === filter), [filter, localStatus, resolvedPersonIds])
  const counts = alerts.reduce((result, alert) => { const current = getStatus(alert.id, alert.personId, alert.status); result[current] += 1; return result }, { '미처리': 0, '확인 중': 0, '완료': 0 })
  const update = (alertId: number, personId: number, status: AlertStatus) => { setLocalStatus(current => ({ ...current, [alertId]: status })); if (status === '완료') onResolve(personId) }

  return <div className="space-y-4 p-4 pb-24 sm:p-6 lg:p-8">
    <section className="grid grid-cols-3 gap-3">{[
      { label:'미처리' as const, icon:Siren, tone:'bg-rose-100 text-rose-700' },
      { label:'확인 중' as const, icon:Clock3, tone:'bg-orange-100 text-orange-700' },
      { label:'완료' as const, icon:CheckCircle2, tone:'bg-emerald-100 text-emerald-700' },
    ].map(({label,icon:Icon,tone})=><button key={label} onClick={()=>setFilter(label)} className={`card flex items-center gap-3 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${filter===label?'ring-2 ring-brand-500':''}`}><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone}`}><Icon size={18}/></span><div><p className="text-[11px] font-bold text-slate-500 sm:text-xs">{label}</p><p className="text-xl font-black sm:text-2xl">{counts[label]}<span className="ml-1 text-xs text-slate-400">건</span></p></div></button>)}</section>

    <section className="card overflow-hidden">
      <header className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-extrabold">이상 징후 알림</h3><p className="mt-1 text-xs text-slate-500">대상자 관리 목록과 동일한 밀도로 표시해요</p></div><div className="flex items-center gap-1.5 overflow-x-auto"><Filter size={15} className="shrink-0 text-slate-400"/>{(['전체','미처리','확인 중','완료'] as const).map(status=><button key={status} onClick={()=>setFilter(status)} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition ${filter===status?'bg-slate-900 text-white':'bg-slate-100 text-slate-500 hover:bg-brand-50 hover:text-brand-700'}`}>{status}</button>)}</div></header>
      <div className="space-y-2 p-2 sm:p-3">{shown.map(alert=>{const original=people.find(person=>person.id===alert.personId)!;const status=getStatus(alert.id,alert.personId,alert.status);const resolved=status==='완료';const person={...original,risk:resolved?'정상' as const:original.risk};return <article key={alert.id} className={`group flex items-center gap-3 rounded-xl border-l-4 p-3 transition hover:-translate-y-0.5 hover:shadow-md ${riskStyle[person.risk].surface} ${person.risk==='긴급'?'emergency-row':''}`}>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ring-2 ring-white ${resolved?'bg-emerald-600 text-white':person.risk==='긴급'?'bg-white text-rose-700':'bg-white/80 text-orange-600'}`}>{resolved?<CheckCircle2 size={20}/>:<AlertTriangle size={20}/>}</div>
        <div className="min-w-0 flex-1"><div className="flex min-w-0 items-center gap-2"><button onClick={()=>onSelect(original)} className="shrink-0 whitespace-nowrap text-sm font-extrabold hover:underline">{person.name}</button><span className="hidden sm:inline"><RiskBadge risk={person.risk}/></span><span className="truncate text-[11px] text-slate-500">{alert.occurredAt}</span></div><div className="mt-1 flex min-w-0 gap-2"><b className="shrink-0 text-xs">{resolved?'안전 확인 완료':alert.category}</b><p className="truncate text-xs text-slate-500">{resolved?'담당 복지사가 대상자의 안전을 확인했어요':person.reason}</p></div></div>
        <div className="hidden shrink-0 sm:block"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status==='완료'?'bg-emerald-600 text-white':status==='확인 중'?'bg-orange-500 text-white':'bg-white/85 text-rose-700'}`}>{status}</span></div>
        <div className="flex shrink-0 gap-1.5"><button onClick={()=>onSelect(original)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-700 transition hover:border-brand-300 hover:text-brand-700">상세 확인</button>{status==='미처리'&&<button onClick={()=>update(alert.id,alert.personId,'확인 중')} className="rounded-lg bg-orange-500 px-2.5 py-2 text-[11px] font-bold text-white hover:bg-orange-600">확인 시작</button>}{status==='확인 중'&&<button onClick={()=>update(alert.id,alert.personId,'완료')} className="rounded-lg bg-emerald-600 px-2.5 py-2 text-[11px] font-bold text-white hover:bg-emerald-700">완료 처리</button>}</div>
      </article>})}{shown.length===0&&<div className="p-12 text-center text-sm text-slate-400">해당 상태의 알림이 없습니다.</div>}</div>
    </section>
  </div>
}
