import { useEffect, useRef, useState } from 'react'
import { people } from '../data/mockData'
import type { LiveMeasurement, Risk } from '../types'

const riskRatio: Record<Risk, number> = { 긴급: .03, 주의: .42, 관심: .72, 정상: 1 }
const riskReason: Record<Risk, string> = {
  긴급: '평소 활동 시간대에 생활 전력이 감지되지 않음',
  주의: '개인 평소 기준보다 사용량이 50% 이상 감소',
  관심: '개인 평소 기준에서 20% 이상 벗어남',
  정상: '개인 평소 사용 범위 안에서 측정 중',
}

function createMeasurement(personId: number, index: number): LiveMeasurement {
  const person = people[index]
  const baselineWatts = 180 + (index * 29) % 240
  const watts = Math.round(baselineWatts * riskRatio[person.risk])
  return { personId, watts, previousWatts: watts, baselineWatts, deviationPercent: Math.round((watts - baselineWatts) / baselineWatts * 100), receivedAt: new Date(), reason: riskReason[person.risk], changed: false }
}

export function useLiveMeasurements(intervalMs = 2800) {
  const [measurements, setMeasurements] = useState<LiveMeasurement[]>(() => people.map((person, index) => createMeasurement(person.id, index)))
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const tick = useRef(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      tick.current += 1
      const now = new Date()
      setMeasurements(current => current.map((item, index) => {
        const person = people[index]
        const wave = Math.sin((tick.current + index * 1.7) / 2) * (person.risk === '정상' ? .06 : .025)
        const nextWatts = Math.max(2, Math.round(item.baselineWatts * (riskRatio[person.risk] + wave)))
        return { ...item, previousWatts: item.watts, watts: nextWatts, deviationPercent: Math.round((nextWatts - item.baselineWatts) / item.baselineWatts * 100), receivedAt: now, reason: riskReason[person.risk], changed: nextWatts !== item.watts }
      }))
      setLastUpdated(now)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])

  return { measurements, lastUpdated }
}
