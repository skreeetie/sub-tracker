"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney, formatMoneyCompact } from "@/shared/lib";

export interface MonthChartPoint {
  month: string;
  /** Подпись на оси: "окт." */
  label: string;
  /** Подпись в подсказке: "октябрь 2026 г." */
  fullLabel: string;
  totalMinor: number;
}

interface SpendingByMonthChartProps {
  data: MonthChartPoint[];
}

const axisTick = { fill: "var(--muted)", fontSize: 11 };

export function SpendingByMonthChart({ data }: SpendingByMonthChartProps) {
  return (
    <BarChart
      responsive
      data={data}
      margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
      style={{ width: "100%", height: 240 }}
      aria-hidden="true"
    >
      <CartesianGrid vertical={false} stroke="var(--line)" />
      <XAxis
        dataKey="month"
        tickFormatter={(month: string) => data.find((point) => point.month === month)?.label ?? month}
        tick={axisTick}
        tickLine={false}
        axisLine={{ stroke: "var(--line)" }}
        interval="preserveStartEnd"
        minTickGap={2}
      />
      <YAxis
        tickFormatter={(value: number) => formatMoneyCompact(value)}
        tick={axisTick}
        tickLine={false}
        axisLine={false}
        width={72}
        allowDecimals={false}
      />
      <Tooltip
        cursor={{ fill: "var(--surface-muted)" }}
        content={({ active, label }) => {
          const point = active ? data.find((item) => item.month === label) : undefined;
          if (!point) {
            return null;
          }
          return (
            <div className="rounded-control border border-line bg-surface px-3 py-2 text-sm shadow-lg">
              <p className="text-muted">{point.fullLabel}</p>
              <p className="font-semibold text-ink tabular-nums">{formatMoney(point.totalMinor)}</p>
            </div>
          );
        }}
      />
      <Bar dataKey="totalMinor" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={24} />
    </BarChart>
  );
}
