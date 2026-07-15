import { useMemo, useState } from "react";
import { BottomNav } from "./components/layout/BottomNav";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { AlertsPage } from "./pages/AlertsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MapPage } from "./pages/MapPage";
import { PeoplePage } from "./pages/PeoplePage";
import { PersonDetailPage } from "./pages/PersonDetailPage";
import { PowerMonitoringPage } from "./pages/PowerMonitoringPage";
import { AssignmentsPage } from "./pages/AssignmentsPage";
import type { Page, Person } from "./types";
import { alerts, people } from "./data/mockData";
import { careManagers } from "./data/managers";

const titles: Record<Page, string> = {
  dashboard: "대시보드",
  map: "지도 모니터링",
  power: "전력 모니터링",
  people: "대상자 관리",
  assignments: "담당자 배정",
  alerts: "이상 징후·알림",
};

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [selected, setSelected] = useState<Person | null>(null);
  const [resolvedPersonIds, setResolvedPersonIds] = useState<Set<number>>(() => new Set());
  const [menu, setMenu] = useState(false);
  const [managerAssignments, setManagerAssignments] = useState<Record<number, string>>(() =>
    Object.fromEntries(people.map((person, index) => [person.id, careManagers[index % careManagers.length].name])),
  );
  const unresolvedAlertCount = alerts.filter(alert => alert.status === "미처리" && !resolvedPersonIds.has(alert.personId)).length;
  const title = useMemo(
    () => (selected ? "대상자 상세" : titles[page]),
    [page, selected],
  );
  const navigate = (next: Page) => {
    setSelected(null);
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const selectPerson = (person: Person) => setSelected({ ...person, manager: managerAssignments[person.id] ?? person.manager });
  const assignManagers = (personIds: number[], manager: string) => {
    setManagerAssignments((current) => {
      const next = { ...current };
      personIds.forEach((id) => { next[id] = manager; });
      return next;
    });
    setSelected((current) => current && personIds.includes(current.id) ? { ...current, manager } : current);
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        page={page}
        setPage={navigate}
        open={menu}
        close={() => setMenu(false)}
        alertCount={unresolvedAlertCount}
      />
      <main className="min-h-screen lg:ml-[270px]">
        <Header
          title={title}
          onMenu={() => setMenu(true)}
          onAlerts={() => navigate("alerts")}
          alertCount={unresolvedAlertCount}
        />
        {selected ? (
          <PersonDetailPage
            person={selected}
            isResolved={resolvedPersonIds.has(selected.id)}
            onResolve={() => setResolvedPersonIds(current => new Set(current).add(selected.id))}
            onBack={() => setSelected(null)}
          />
        ) : page === "dashboard" ? (
          <DashboardPage onSelect={selectPerson} setPage={navigate} resolvedPersonIds={resolvedPersonIds} />
        ) : page === "map" ? (
          <MapPage onSelect={selectPerson} resolvedPersonIds={resolvedPersonIds} />
        ) : page === "power" ? (
          <PowerMonitoringPage onSelect={selectPerson} resolvedPersonIds={resolvedPersonIds} />
        ) : page === "people" ? (
          <PeoplePage onSelect={selectPerson} resolvedPersonIds={resolvedPersonIds} assignments={managerAssignments} />
        ) : page === "assignments" ? (
          <AssignmentsPage assignments={managerAssignments} onAssign={assignManagers} onSelect={selectPerson} />
        ) : (
          <AlertsPage onSelect={selectPerson} resolvedPersonIds={resolvedPersonIds} onResolve={personId => setResolvedPersonIds(current => new Set(current).add(personId))} />
        )}
      </main>
      {!selected && <BottomNav page={page} setPage={navigate} alertCount={unresolvedAlertCount} />}
    </div>
  );
}
