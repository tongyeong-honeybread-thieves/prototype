import type { LivePowerPoint, Risk } from '../../types'

interface UsagePatternChartProps { data:LivePowerPoint[]; risk:Risk; baselineWatts:number; inactiveHours:number }

const palette:Record<Risk,{bar:string;soft:string;text:string}>={
  긴급:{bar:'#ef4444',soft:'#fef2f2',text:'#b91c1c'},주의:{bar:'#f97316',soft:'#fff7ed',text:'#c2410c'},관심:{bar:'#eab308',soft:'#fefce8',text:'#a16207'},정상:{bar:'#14b8a6',soft:'#f0fdfa',text:'#0f766e'},
}

function Bars({values,color,max=100,binary=false}:{values:number[];color:string;max?:number;binary?:boolean}){
  const width=640,height=82,gap=2,barWidth=width/values.length-gap
  return <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-[82px] w-full" aria-hidden="true"><line x1="0" x2={width} y1={height-1} y2={height-1} stroke="#cbd5e1"/>{values.map((value,index)=>{const normalized=binary?(value>0?1:0):Math.min(1,value/max);const barHeight=Math.max(binary&&value<=0?1.5:3,normalized*(height-8));return <rect key={index} x={index*(barWidth+gap)} y={height-barHeight-1} width={barWidth} height={barHeight} rx="1.2" fill={value>0?color:'#e2e8f0'} opacity={index===values.length-1?1:.72}/>})}</svg>
}

export function VitalPowerChart({data,risk,baselineWatts,inactiveHours}:UsagePatternChartProps){
  const tone=palette[risk]
  const activityThreshold=baselineWatts*.35
  const recentPower=data.map(point=>Math.round(point.watts/baselineWatts*1000)/10)
  const currentRatio=Math.min(100,(data[data.length-1]?.watts??0)/baselineWatts*100)
  const dayPattern=Array.from({length:48},(_,index)=>{const hour=index/2;const daytime=hour>=7.5&&hour<=19;let value=daytime?62+Math.sin((hour-8)*1.2)*13+Math.sin(index*.73)*9:7+Math.max(0,Math.sin(index*1.4))*11;if(risk==='긴급'&&index>=48-inactiveHours*2)value=2;if(risk==='주의'&&index>=38)value*=.48;if(risk==='관심'&&index>=42)value*=.72;return Math.max(0,Math.min(100,Math.round(value)))})
  dayPattern[dayPattern.length-1]=Math.round(currentRatio)
  const activeScore=Math.round((dayPattern.reduce((sum,value)=>sum+value,0)/dayPattern.length)*100)/100
  const correlation=risk==='긴급'?.184:risk==='주의'?.438:risk==='관심'?.611:.812
  const low=Math.round(baselineWatts*.12*10)/10,norm=Math.round(baselineWatts*.52*10)/10,high=Math.round(baselineWatts*.88*10)/10
  const activityDetected=(data[data.length-1]?.watts??0)>=activityThreshold
  return <div className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100" style={{backgroundColor:tone.soft}}><div className="p-3"><p className="text-[10px] font-bold text-slate-400">활동 점수</p><p className="mt-0.5 text-lg font-black" style={{color:tone.text}}>{activeScore.toFixed(2)}</p></div><div className="p-3"><p className="text-[10px] font-bold text-slate-400">평소 패턴 상관계수</p><p className="mt-0.5 text-lg font-black" style={{color:tone.text}}>{correlation.toFixed(3)}</p></div></div>
    <div className="p-3 sm:p-4"><div className="flex items-center justify-between"><div><h4 className="text-xs font-extrabold text-slate-700">최근 1분 전력 변화</h4><p className="mt-0.5 text-[10px] text-slate-400">개인 평소 전력 대비 사용 비율 · 기준 {activityThreshold.toFixed(1)}W</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${activityDetected?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-500'}`}>{activityDetected?'활동 감지':'활동 없음'}</span></div><div className="mt-2"><Bars values={recentPower} color={tone.bar} max={Math.max(115,...recentPower)}/></div><div className="mt-1 flex justify-between text-[9px] text-slate-400"><span>1분 전</span><span className="text-slate-500">평소 대비 %</span><span className="font-bold" style={{color:tone.text}}>실시간</span></div>
      <div className="mt-4 border-t border-slate-100 pt-4"><div className="flex items-center justify-between"><div><h4 className="text-xs font-extrabold text-slate-700">24시간 생활 활동 패턴</h4><p className="mt-0.5 text-[10px] text-slate-400">개인별 전력 사용 정규화 · 0~100</p></div>{risk==='긴급'&&<span className="rounded-lg bg-rose-50 px-2 py-1 text-[10px] font-black text-rose-700">{inactiveHours}시간 연속 기준 미달</span>}</div><div className="mt-2"><Bars values={dayPattern} color={tone.bar}/></div><div className="mt-1 flex justify-between text-[9px] text-slate-400"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div></div>
    </div><div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50 text-center"><div className="px-2 py-2"><p className="text-[9px] text-slate-400">낮음 기준</p><b className="text-[11px] text-slate-600">{low.toFixed(1)}W</b></div><div className="px-2 py-2"><p className="text-[9px] text-slate-400">표준 점수</p><b className="text-[11px] text-slate-600">{norm.toFixed(1)}W</b></div><div className="px-2 py-2"><p className="text-[9px] text-slate-400">높음 기준</p><b className="text-[11px] text-slate-600">{high.toFixed(1)}W</b></div></div></div>
}
