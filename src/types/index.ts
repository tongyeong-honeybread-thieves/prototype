export type Risk = "긴급" | "주의" | "관심" | "정상";
export type Page = "dashboard" | "map" | "power" | "people" | "assignments" | "alerts";
export type AlertStatus = "미처리" | "확인 중" | "완료";

export interface Person {
  id: number;
  name: string;
  age: number;
  gender: "남" | "여";
  district: string;
  address: string;
  lat: number;
  lng: number;
  risk: Risk;
  lastActive: string;
  inactiveHours: number;
  reason: string;
  condition: string[];
  guardian: string;
  guardianRelation: string;
  guardianPhone: string;
  phone: string;
  meter: "정상" | "점검 필요";
  note: string;
  manager: string;
  lastContactAt?: string;
  lastContactMethod?: "전화" | "방문" | "보호자 연락";
  lastContactResult?: string;
}

export interface SafetyAlert {
  id: number;
  personId: number;
  occurredAt: string;
  category: string;
  status: AlertStatus;
}

export interface LiveMeasurement {
  personId: number
  watts: number
  previousWatts: number
  baselineWatts: number
  deviationPercent: number
  receivedAt: Date
  reason: string
  changed: boolean
}

export interface LivePowerPoint {
  timestamp: number
  label: string
  watts: number
}
