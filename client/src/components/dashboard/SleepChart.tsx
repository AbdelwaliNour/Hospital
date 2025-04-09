import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SleepDataPoint {
  month: string;
  hours: number;
}

interface SleepChartProps {
  data: SleepDataPoint[];
  averageHours: number;
}

export default function SleepChart({ data, averageHours }: SleepChartProps) {
  const [timeRange, setTimeRange] = useState("monthly");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Sleeping Periodic</h3>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[100px] bg-gray-100 text-sm">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[200px] relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-light text-white text-xs px-2 py-1 rounded-lg">
          {averageHours} hours
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
          >
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#5B6D7A' }}
              dy={10}
            />
            <YAxis hide domain={[0, 10]} />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: 'none', 
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value) => [`${value} hours`]}
            />
            <Bar 
              dataKey="hours" 
              fill="#4A90E2" 
              radius={[4, 4, 0, 0]}
              barSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
