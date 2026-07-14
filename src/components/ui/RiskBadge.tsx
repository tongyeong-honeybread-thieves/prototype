import { Siren } from 'lucide-react'
import { riskStyle } from '../../constants/ui'
import type { Risk } from '../../types'

export function RiskBadge({ risk }: { risk: Risk }) {
  return <span className={`inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-0 align-middle text-xs font-bold leading-none ring-1 ring-inset ${riskStyle[risk].badge} ${risk === '긴급' ? 'emergency-badge' : ''}`}>
    {risk === '긴급' ? <Siren size={13} className="emergency-siren-icon" /> : <span className={`h-1.5 w-1.5 rounded-full ${riskStyle[risk].dot}`} />}
    <span className="relative -translate-y-px leading-none">{risk === '긴급' ? '긴급 · 즉시 확인' : risk}</span>
  </span>
}
