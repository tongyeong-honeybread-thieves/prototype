import { Check, Search, UserCheck, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { RiskBadge } from '../components/ui/RiskBadge'
import { careManagers } from '../data/managers'
import { districts, people } from '../data/mockData'
import type { Person } from '../types'

export function AssignmentsPage({
  assignments,
  onAssign,
  onSelect,
}: {
  assignments: Record<number, string>
  onAssign: (personIds: number[], manager: string) => void
  onSelect: (person: Person) => void
}) {
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState('전체 지역')
  const [managerFilter, setManagerFilter] = useState('전체 담당자')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [bulkManager, setBulkManager] = useState(careManagers[0].name)
  const [saved, setSaved] = useState('')

  const shown = useMemo(() => people.filter((person) =>
    (district === '전체 지역' || person.district === district)
    && (managerFilter === '전체 담당자' || assignments[person.id] === managerFilter)
    && (person.name.includes(query) || person.address.includes(query)),
  ), [assignments, district, managerFilter, query])

  const counts = useMemo(() => Object.values(assignments).reduce<Record<string, number>>((result, name) => {
    result[name] = (result[name] ?? 0) + 1
    return result
  }, {}), [assignments])

  const toggle = (id: number) => setSelectedIds((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const assign = (ids: number[], manager: string) => {
    if (!ids.length) return
    onAssign(ids, manager)
    setSaved(`${ids.length}명을 ${manager} 복지사에게 배정했습니다.`)
    setSelectedIds(new Set())
    window.setTimeout(() => setSaved(''), 2600)
  }

  return (
    <div className="p-4 pb-24 sm:p-6 lg:p-8">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {careManagers.map((manager) => {
          const assigned = counts[manager.name] ?? 0
          const ratio = Math.min(100, (assigned / manager.capacity) * 100)
          return (
            <button key={manager.id} onClick={() => setManagerFilter(manager.name)} className="card p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-xs font-extrabold text-brand-700">{manager.name.slice(-2)}</span>
                <span className="text-xs text-slate-400">{assigned}/{manager.capacity}명</span>
              </div>
              <b className="mt-3 block text-sm">{manager.name} 복지사</b>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">{manager.team}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${ratio >= 90 ? 'bg-orange-500' : 'bg-brand-500'}`} style={{ width: `${ratio}%` }} /></div>
            </button>
          )
        })}
      </section>

      <section className="card mt-5 overflow-hidden">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="mr-auto">
              <h3 className="font-extrabold">대상자 담당자 배정</h3>
              <p className="mt-1 text-xs text-slate-500">기관 소속 복지사에게 관리 대상자를 지정하거나 변경합니다.</p>
            </div>
            <label className="relative min-w-0 xl:w-64"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="대상자 검색" className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs" /></label>
            <select value={district} onChange={(event) => setDistrict(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold"><option>전체 지역</option>{districts.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={managerFilter} onChange={(event) => setManagerFilter(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold"><option>전체 담당자</option>{careManagers.map((manager) => <option key={manager.id}>{manager.name}</option>)}</select>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-brand-100 bg-brand-50 px-4 py-3">
            <b className="mr-auto text-xs text-brand-800">{selectedIds.size}명 선택됨</b>
            <select value={bulkManager} onChange={(event) => setBulkManager(event.target.value)} className="h-9 rounded-lg border border-brand-200 bg-white px-3 text-xs font-bold">{careManagers.map((manager) => <option key={manager.id}>{manager.name}</option>)}</select>
            <button onClick={() => assign([...selectedIds], bulkManager)} className="h-9 rounded-lg bg-brand-600 px-3 text-xs font-bold text-white hover:bg-brand-700">선택 대상 배정</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-[11px] text-slate-500"><tr><th className="w-12 px-4 py-3"><button onClick={() => setSelectedIds(selectedIds.size === shown.length ? new Set() : new Set(shown.map((person) => person.id)))} className="grid h-5 w-5 place-items-center rounded border border-slate-300 bg-white">{shown.length > 0 && selectedIds.size === shown.length && <Check size={13} />}</button></th><th className="px-3 py-3">대상자</th><th className="px-3 py-3">위험도</th><th className="px-3 py-3">지역</th><th className="px-3 py-3">현재 담당자</th><th className="px-4 py-3 text-right">담당자 변경</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((person) => (
                <tr key={person.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3"><button onClick={() => toggle(person.id)} className={`grid h-5 w-5 place-items-center rounded border ${selectedIds.has(person.id) ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white'}`}>{selectedIds.has(person.id) && <Check size={13} />}</button></td>
                  <td className="px-3 py-3"><button onClick={() => onSelect({ ...person, manager: assignments[person.id] })} className="flex items-center gap-2 text-left"><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-[10px] font-bold">{person.name.slice(-2)}</span><span><b className="block text-xs">{person.name}</b><span className="text-[10px] text-slate-400">{person.age}세 · {person.gender}성</span></span></button></td>
                  <td className="px-3 py-3"><RiskBadge risk={person.risk} /></td>
                  <td className="px-3 py-3 text-xs text-slate-500">{person.district}</td>
                  <td className="px-3 py-3 text-xs font-bold text-slate-700">{assignments[person.id]}</td>
                  <td className="px-4 py-3 text-right"><select value={assignments[person.id]} onChange={(event) => assign([person.id], event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold">{careManagers.map((manager) => <option key={manager.id}>{manager.name}</option>)}</select></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {saved && <div className="fixed bottom-24 left-1/2 z-[1500] flex -translate-x-1/2 items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-xl lg:bottom-8"><UserCheck size={16} className="text-emerald-400" />{saved}</div>}
      {!shown.length && <div className="card mt-4 grid min-h-48 place-items-center text-sm text-slate-400"><div className="text-center"><UsersRound className="mx-auto mb-2" />조건에 맞는 대상자가 없습니다.</div></div>}
    </div>
  )
}
