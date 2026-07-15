import { useEffect, useRef, useState } from 'react'
import { people } from '../data/mockData'
import type { LiveMeasurement, LivePowerPoint, Risk } from '../types'

const riskRatio: Record<Risk, number> = { 긴급: .035, 주의: .46, 관심: .74, 정상: 1 }
const riskReason: Record<Risk, string> = { 긴급: '예상 활동 시간대에 저전력 상태가 장시간 지속', 주의: '개인 평소 기준보다 사용량이 50% 이상 감소', 관심: '개인 평소 기준에서 20% 이상 이탈', 정상: '개인 평소 사용 범위 안에서 측정 중' }
const baselineFor = (index: number) => 185.4 + (index * 29.7) % 238
const valueAt = (index: number, risk: Risk, step: number) => {
  const baseline = baselineFor(index)
  const slowWave = Math.sin((step + index * 1.31) / 2.7)
  const sensorRipple = Math.sin((step + index) * 2.17) * .018
  const amplitude = risk === '정상' ? .095 : risk === '관심' ? .045 : .022
  return Math.max(2.1, Math.round(baseline * (riskRatio[risk] + slowWave * amplitude + sensorRipple) * 10) / 10)
}
const timeLabel = (date: Date) => date.toLocaleTimeString('ko-KR', { minute:'2-digit', second:'2-digit' })

function initialMeasurement(index: number): LiveMeasurement {
  const person = people[index]
  const baselineWatts = Math.round(baselineFor(index) * 10) / 10
  const watts = valueAt(index, person.risk, 0)
  return { personId:person.id, watts, previousWatts:watts, baselineWatts, deviationPercent:Math.round((watts-baselineWatts)/baselineWatts*1000)/10, receivedAt:new Date(), reason:riskReason[person.risk], changed:false }
}

function initialHistory(): Record<number, LivePowerPoint[]> {
  const now = Date.now()
  return Object.fromEntries(people.map((person,index)=>[person.id,Array.from({length:20},(_,pointIndex)=>{const timestamp=now-(19-pointIndex)*2800;return{timestamp,label:timeLabel(new Date(timestamp)),watts:valueAt(index,person.risk,pointIndex-19)}})]))
}

export function useLiveMeasurements(intervalMs=2800) {
  const [measurements,setMeasurements]=useState<LiveMeasurement[]>(()=>people.map((_,index)=>initialMeasurement(index)))
  const [historyByPerson,setHistoryByPerson]=useState<Record<number,LivePowerPoint[]>>(initialHistory)
  const [lastUpdated,setLastUpdated]=useState(new Date())
  const tick=useRef(0)
  useEffect(()=>{const timer=window.setInterval(()=>{tick.current+=1;const now=new Date();const nextValues=people.map((person,index)=>valueAt(index,person.risk,tick.current));setMeasurements(current=>current.map((item,index)=>{const watts=nextValues[index];return{...item,previousWatts:item.watts,watts,deviationPercent:Math.round((watts-item.baselineWatts)/item.baselineWatts*1000)/10,receivedAt:now,reason:riskReason[people[index].risk],changed:watts!==item.watts}}));setHistoryByPerson(current=>Object.fromEntries(people.map((person,index)=>[person.id,[...(current[person.id]??[]),{timestamp:now.getTime(),label:timeLabel(now),watts:nextValues[index]}].slice(-20)])));setLastUpdated(now)},intervalMs);return()=>window.clearInterval(timer)},[intervalMs])
  return {measurements,historyByPerson,lastUpdated}
}
