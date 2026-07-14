import { useEffect } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap, ZoomControl } from 'react-leaflet'
import { riskStyle } from '../../constants/ui'
import type { Person } from '../../types'
import { RiskBadge } from '../ui/RiskBadge'

interface SafetyMapProps {
  people: Person[]
  onSelect: (person: Person) => void
  interactive?: boolean
  zoom?: number
  focusedPersonId?: number | null
  onMarkerFocus?: (person: Person) => void
  showDetailAction?: boolean
}

function MapFocus({ person }: { person?: Person }) {
  const map = useMap()
  useEffect(() => {
    if (!person) return
    map.flyTo([person.lat, person.lng], 15, { animate: true, duration: 1.1 })
    const moveEnd = () => {
      if (window.innerWidth < 640) map.panBy([0, 120], { animate: true, duration: .45 })
    }
    map.once('moveend', moveEnd)
    return () => { map.off('moveend', moveEnd) }
  }, [map, person])
  return null
}

export function SafetyMap({ people, onSelect, interactive = true, zoom = 11, focusedPersonId, onMarkerFocus, showDetailAction = true }: SafetyMapProps) {
  const focusedPerson = people.find(person => person.id === focusedPersonId)
  return <MapContainer center={[35.22, 128.64]} zoom={zoom} zoomControl={false} scrollWheelZoom={interactive} doubleClickZoom={interactive} touchZoom={interactive} dragging={interactive} className="z-0 rounded-2xl">
    <MapFocus person={focusedPerson} />
    {interactive && <ZoomControl position="bottomright" />}
    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {people.map(person => { const focused = person.id === focusedPersonId; return <CircleMarker key={person.id} center={[person.lat, person.lng]} radius={focused ? 13 : person.risk === '긴급' ? 9 : 6} pathOptions={{ color:focused ? '#0f172a' : '#fff', weight:focused ? 4 : 2, fillColor:riskStyle[person.risk].color, fillOpacity:1 }} eventHandlers={{ click:()=>onMarkerFocus?.(person) }}>
      {focused && <Tooltip permanent direction="top" offset={[0,-12]} opacity={1} className="selected-person-tooltip"><div className="text-center"><b>{person.name}</b><div className="text-[10px] text-slate-500">{person.age}세 · {person.district}</div></div></Tooltip>}
      <Popup><div className="min-w-48 p-1"><div className="flex items-center justify-between gap-3"><b>{person.name} · {person.age}세</b><RiskBadge risk={person.risk}/></div><p className="my-2 text-xs text-slate-500">{person.address}</p><p className="mb-3 text-xs">{person.reason}</p>{showDetailAction&&<button onClick={()=>onSelect(person)} className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-700 active:scale-[.98]">상세 정보 보기</button>}</div></Popup>
    </CircleMarker>})}
  </MapContainer>
}
