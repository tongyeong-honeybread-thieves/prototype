import type { Risk } from "../types";

export const riskStyle: Record<
  Risk,
  { dot: string; badge: string; color: string; surface: string }
> = {
  긴급: {
    dot: "bg-rose-600",
    badge: "bg-rose-600 text-white ring-rose-700",
    color: "#e11d48",
    surface: "border-rose-600 bg-rose-100 ring-1 ring-inset ring-rose-300",
  },
  주의: {
    dot: "bg-orange-600",
    badge: "bg-orange-100 text-orange-800 ring-orange-300",
    color: "#ea580c",
    surface: "border-orange-300 bg-orange-50/80 ring-1 ring-inset ring-orange-100",
  },
  관심: {
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-800 ring-amber-300",
    color: "#f59e0b",
    surface: "border-amber-300 bg-amber-50/80 ring-1 ring-inset ring-amber-100",
  },
  정상: {
    dot: "bg-emerald-600",
    badge: "bg-emerald-600 text-white ring-emerald-700",
    color: "#059669",
    surface: "border-emerald-400 bg-emerald-100/80 ring-1 ring-inset ring-emerald-200",
  },
};
