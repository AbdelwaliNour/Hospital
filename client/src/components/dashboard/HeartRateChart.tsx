import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeartRateDataPoint {
  time: string;
  value: number;
}

interface HeartRateChartProps {
  data: HeartRateDataPoint[];
  currentBPM: number;
}

export default function HeartRateChart({ data, currentBPM }: HeartRateChartProps) {
  const [timeRange, setTimeRange] = useState("hourly");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Heart Rate</h3>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[100px] bg-gray-100 text-sm">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1366AE" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1366AE" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#5B6D7A' }}
              dy={10}
            />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: 'none', 
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value) => [`${value} BPM`]}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#1366AE" 
              strokeWidth={2}
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 text-3xl font-semibold text-primary">
          <div className="flex items-end space-x-1">
            <span>{currentBPM}</span>
            <span className="text-sm mb-1 text-gray-600">BPM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
