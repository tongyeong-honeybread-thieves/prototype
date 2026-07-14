import { riskStyle } from '../../constants/ui'
import type { Person } from '../../types'
import { RiskBadge } from '../ui/RiskBadge'

interface PersonRowProps {
  person: Person
  onClick: () => void
  onDetails?: () => void
}

export function PersonRow({ person, onClick, onDetails }: PersonRowProps) {
  const openDetails = onDetails ?? onClick
  return <div role="button" tabIndex={0} onClick={onClick} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onClick()}}} className={`group focus-ring my-1 flex w-full cursor-pointer items-center gap-3 rounded-xl border-l-4 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:brightness-[.97] hover:shadow-md active:translate-y-0 active:scale-[.99] ${riskStyle[person.risk].surface} ${person.risk==='긴급'?'emergency-row':''}`}>
    <div className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-extrabold ring-2 ring-white transition-transform group-hover:scale-105 ${person.risk==='긴급'?'bg-rose-100 text-rose-700':person.risk==='주의'?'bg-orange-100 text-orange-700':person.risk==='관심'?'bg-amber-100 text-amber-700':'bg-emerald-100 text-emerald-700'}`}>{person.name.slice(-2)}<span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${riskStyle[person.risk].dot}`}/></div>
    <div className="min-w-0 flex-1"><div className="flex min-w-0 items-center gap-2"><b className="shrink-0 whitespace-nowrap text-sm group-hover:text-brand-700">{person.name}</b><span className="min-w-0 truncate text-xs text-slate-400">{person.age}세 · {person.district}</span></div><p className="mt-1 truncate text-xs text-slate-500">{person.reason}</p></div>
    <div className="hidden shrink-0 text-right md:block"><RiskBadge risk={person.risk}/><p className="mt-1 whitespace-nowrap text-[11px] text-slate-400">{person.lastActive}</p></div>
    <button onClick={event=>{event.stopPropagation();openDetails()}} className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[11px] font-bold text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:scale-95 sm:px-3">상세 확인</button>
  </div>
}
