import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DepartmentStaffData {
  name: string;
  value: number;
  percentage: number;
}

interface DepartmentStaffProps {
  data: DepartmentStaffData[];
}

export default function DepartmentStaff({ data }: DepartmentStaffProps) {
  const [timeRange, setTimeRange] = useState("yearly");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Staff by Department</h3>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[100px] bg-gray-100 text-sm">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[200px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            barGap={8}
          >
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#5B6D7A' }}
              dy={10}
            />
            <YAxis 
              hide 
              domain={[0, 'dataMax + 20']} 
            />
            <Tooltip 
              contentStyle={{ 
                background: 'white', 
                border: 'none', 
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value, name) => [value, 'Staff']}
              labelFormatter={() => ''}
            />
            <Bar 
              dataKey="value" 
              fill="#1366AE" 
              radius={[4, 4, 0, 0]}
              barSize={25}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        {data.map((department, index) => (
          <span key={index}>{department.name}</span>
        ))}
      </div>
    </div>
  );
}
