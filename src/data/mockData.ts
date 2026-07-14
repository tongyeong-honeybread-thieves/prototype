import type { Person, Risk, SafetyAlert } from "../types";

const core: Omit<Person, "manager">[] = [
  {
    id: 1,
    name: "김영자",
    age: 82,
    gender: "여",
    district: "의창구",
    address: "창원시 의창구 소답동",
    lat: 35.2634,
    lng: 128.6247,
    risk: "긴급",
    lastActive: "어제 21:42",
    inactiveHours: 14,
    reason: "평소 기상 시간 이후 활동이 감지되지 않았어요",
    condition: ["고혈압", "당뇨", "낙상 위험"],
    guardian: "김민수",
    guardianRelation: "아들",
    guardianPhone: "010-2471-8902",
    phone: "055-291-1048",
    meter: "정상",
    note: "보행 보조기를 사용하며 매주 화요일 복지관 방문",
  },
  {
    id: 2,
    name: "박순희",
    age: 79,
    gender: "여",
    district: "성산구",
    address: "창원시 성산구 가음동",
    lat: 35.2072,
    lng: 128.6982,
    risk: "긴급",
    lastActive: "오늘 01:18",
    inactiveHours: 10,
    reason: "최근 7일간 생활 전력 활동이 크게 감소했어요",
    condition: ["심혈관질환", "관절염"],
    guardian: "박지현",
    guardianRelation: "딸",
    guardianPhone: "010-5528-1794",
    phone: "055-264-8821",
    meter: "정상",
    note: "아침 약 복용 여부 확인 필요",
  },
  {
    id: 3,
    name: "이동호",
    age: 84,
    gender: "남",
    district: "마산합포구",
    address: "창원시 마산합포구 완월동",
    lat: 35.1921,
    lng: 128.5588,
    risk: "주의",
    lastActive: "오늘 06:32",
    inactiveHours: 5,
    reason: "아침 활동량이 평소의 38% 수준이에요",
    condition: ["고혈압", "청력 저하"],
    guardian: "이수진",
    guardianRelation: "조카",
    guardianPhone: "010-8312-6670",
    phone: "055-243-3920",
    meter: "정상",
    note: "전화 연결 시 천천히 크게 말하기",
  },
  {
    id: 4,
    name: "최말순",
    age: 77,
    gender: "여",
    district: "진해구",
    address: "창원시 진해구 경화동",
    lat: 35.1543,
    lng: 128.6893,
    risk: "주의",
    lastActive: "오늘 07:04",
    inactiveHours: 4,
    reason: "조리 시간대 전력 사용이 이틀 연속 없어요",
    condition: ["당뇨"],
    guardian: "최성호",
    guardianRelation: "아들",
    guardianPhone: "010-7204-3308",
    phone: "055-547-1820",
    meter: "정상",
    note: "도시락 배달 월·수·금",
  },
  {
    id: 5,
    name: "정재복",
    age: 81,
    gender: "남",
    district: "마산회원구",
    address: "창원시 마산회원구 회원동",
    lat: 35.2246,
    lng: 128.5742,
    risk: "관심",
    lastActive: "오늘 08:41",
    inactiveHours: 2,
    reason: "야간 전력 사용이 평소보다 1.8배 높았어요",
    condition: ["수면장애", "고혈압"],
    guardian: "정은경",
    guardianRelation: "딸",
    guardianPhone: "010-1932-4211",
    phone: "055-248-7721",
    meter: "정상",
    note: "야간 수면 패턴 관찰 중",
  },
  {
    id: 6,
    name: "강옥분",
    age: 75,
    gender: "여",
    district: "성산구",
    address: "창원시 성산구 사파동",
    lat: 35.2181,
    lng: 128.7072,
    risk: "관심",
    lastActive: "오늘 09:12",
    inactiveHours: 1,
    reason: "이번 주 평균 활동량이 12% 감소했어요",
    condition: ["관절염"],
    guardian: "강미정",
    guardianRelation: "동생",
    guardianPhone: "010-4250-1137",
    phone: "055-281-6620",
    meter: "정상",
    note: "목요일 오전 병원 정기 방문",
  },
];

const names = [
  "김춘자",
  "이상철",
  "박옥희",
  "최성만",
  "정복순",
  "강영수",
  "윤정희",
  "장봉수",
  "임선자",
  "한종태",
  "오미숙",
  "서병철",
  "신정애",
  "권영길",
  "황말자",
  "송재근",
  "안복희",
  "류한수",
  "전금자",
  "홍순덕",
  "문영희",
  "배태식",
  "백옥자",
  "노창수",
  "하경자",
  "고인철",
  "양순임",
  "조성태",
  "곽춘희",
  "남정수",
  "심복자",
  "유동근",
  "민영숙",
  "진성호",
  "엄정자",
  "차동식",
  "주옥분",
  "표재호",
  "도순자",
  "변영식",
  "나정임",
  "마창호",
];
export const districts = [
  "의창구",
  "성산구",
  "마산합포구",
  "마산회원구",
  "진해구",
] as const;
const centers: Record<string, [number, number]> = {
  의창구: [35.254, 128.641],
  성산구: [35.215, 128.69],
  마산합포구: [35.193, 128.567],
  마산회원구: [35.229, 128.578],
  진해구: [35.153, 128.704],
};

export const people: Person[] = [
  ...core.map((p) => ({ ...p, manager: "이하늘" })),
  ...names.map((name, i): Person => {
    const district = districts[i % districts.length];
    const c = centers[district];
    const risk: Risk = i < 3 ? "주의" : i < 9 ? "관심" : "정상";
    return {
      id: i + 7,
      name,
      age: 71 + ((i * 7) % 20),
      gender: i % 3 === 0 ? "남" : "여",
      district,
      address: `창원시 ${district} ${["중동", "상남동", "월영동", "합성동", "석동"][i % 5]}`,
      lat: c[0] + ((i % 5) - 2) * 0.006,
      lng: c[1] + ((i % 7) - 3) * 0.006,
      risk,
      lastActive: `오늘 ${String(7 + (i % 4)).padStart(2, "0")}:${String((i * 13) % 60).padStart(2, "0")}`,
      inactiveHours: risk === "주의" ? 5 : risk === "관심" ? 2 : 0,
      reason:
        risk === "주의"
          ? "평소보다 활동 시작이 늦어 확인이 필요해요"
          : risk === "관심"
            ? "생활 전력 패턴에 작은 변화가 감지됐어요"
            : "평소 생활 패턴을 유지하고 있어요",
      condition: i % 2 ? ["고혈압"] : ["관절염"],
      guardian: `${name[0]}민지`,
      guardianRelation: i % 2 ? "딸" : "아들",
      guardianPhone: `010-${String(2100 + i * 37).slice(-4)}-${String(7300 + i * 61).slice(-4)}`,
      phone: `055-${240 + (i % 50)}-${String(1100 + i * 73).slice(-4)}`,
      meter: i === 31 ? "점검 필요" : "정상",
      note: "정기 안부 확인 대상자",
      manager: "이하늘",
    };
  }),
];

people.forEach((person, index) => {
  person.lastContactAt = index < 2 ? "어제 16:10" : `7월 ${14 - (index % 4)}일 ${String(9 + (index % 7)).padStart(2, "0")}:20`;
  person.lastContactMethod = index % 5 === 0 ? "방문" : index % 4 === 0 ? "보호자 연락" : "전화";
  person.lastContactResult = index < 2 ? "본인 통화 완료 · 건강 이상 없음" : index % 5 === 0 ? "방문 확인 완료" : "안부 및 복약 여부 확인 완료";
});

export const alerts: SafetyAlert[] = people
  .filter((p) => p.risk !== "정상")
  .map((p, i) => ({
    id: i + 1,
    personId: p.id,
    occurredAt:
      i < 2
        ? "오늘 10:18"
        : `오늘 ${String(8 + (i % 3)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    category:
      i % 3 === 0
        ? "장시간 미활동"
        : i % 3 === 1
          ? "활동량 감소"
          : "생활패턴 변화",
    status: i < 5 ? "미처리" : i < 8 ? "확인 중" : "완료",
  }));

export const powerData = [
  { time: "00시", usual: 0.12, today: 0.1 },
  { time: "03시", usual: 0.1, today: 0.09 },
  { time: "06시", usual: 0.18, today: 0.08 },
  { time: "07시", usual: 0.62, today: 0.07 },
  { time: "09시", usual: 0.48, today: 0.06 },
  { time: "11시", usual: 0.34, today: 0.05 },
  { time: "13시", usual: 0.56, today: 0 },
  { time: "15시", usual: 0.29, today: 0 },
  { time: "18시", usual: 0.63, today: 0 },
  { time: "21시", usual: 0.37, today: 0 },
];

export const powerChartData = {
  day: powerData,
  week: ["월", "화", "수", "목", "금", "토", "일"].map((time, index) => ({ time, usual: 3.8 + (index % 3) * 0.35, today: index < 5 ? 3.4 + (index % 2) * 0.42 : 2.1 + (index % 2) * 0.3 })),
  month: ["1주", "2주", "3주", "4주", "5주"].map((time, index) => ({ time, usual: 25.6 + index * 1.2, today: 24.8 - index * 2.1 })),
  year: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"].map((time, index) => ({ time, usual: 104 + (index % 4) * 8, today: index < 7 ? 101 - index * 3 + (index % 2) * 9 : 0 })),
};
