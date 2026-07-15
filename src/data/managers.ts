export interface CareManager {
  id: number
  name: string
  team: string
  phone: string
  capacity: number
}

export const careManagers: CareManager[] = [
  { id: 1, name: '이하늘', team: '의창 생활지원팀', phone: '010-2841-1102', capacity: 12 },
  { id: 2, name: '박지민', team: '성산 생활지원팀', phone: '010-5932-2480', capacity: 12 },
  { id: 3, name: '최서윤', team: '마산합포 생활지원팀', phone: '010-7418-3361', capacity: 12 },
  { id: 4, name: '정우진', team: '진해 생활지원팀', phone: '010-3650-9247', capacity: 12 },
  { id: 5, name: '김다은', team: '통합 사례관리팀', phone: '010-8127-5064', capacity: 12 },
]
