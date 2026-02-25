import type { VisitRecord } from '../utils/dummyData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface WeightTrendChartProps {
  visitHistory: VisitRecord[];
  childName: string;
}

export default function WeightTrendChart({ visitHistory, childName }: WeightTrendChartProps) {
  const data = visitHistory.map(v => ({
    date: new Date(v.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    weight: v.weight,
  }));

  const minWeight = Math.min(...data.map(d => d.weight)) - 0.5;
  const maxWeight = Math.max(...data.map(d => d.weight)) + 0.5;

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Weight trend – last 3 visits ({childName})</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={[minWeight, maxWeight]} tick={{ fontSize: 11 }} unit=" kg" />
          <Tooltip
            formatter={(value: number) => [`${value} kg`, 'Weight']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#4ade80"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#4ade80', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
