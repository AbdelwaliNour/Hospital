import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DepartmentData {
  name: string;
  value: number;
  color: string;
}

interface DepartmentChartProps {
  data: DepartmentData[];
}

export default function DepartmentChart({ data }: DepartmentChartProps) {
  const [timeRange, setTimeRange] = useState("weekly");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Patient Visit by Department</h3>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[100px] bg-gray-100 text-sm">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="w-[160px] h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data && data.length > 0 ? data : [{ name: 'No Data', value: 100, color: '#e0e0e0' }]}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                label={false}
              >
                {(data && data.length > 0 ? data : [{ name: 'No Data', value: 100, color: '#e0e0e0' }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: 'none', 
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
                formatter={(value) => [`${value}%`, 'Percentage']}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 24, fontWeight: 600, fill: '#263238' }}
              >
                {data && data.length > 0 ? `${data[0].value}%` : '0%'}
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data && data.length > 0 ? data.map((department, index) => (
          <div key={index} className="flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: department.color }}
            ></span>
            <span className="text-sm text-gray-800">{department.name}</span>
            <span className="ml-auto text-sm font-medium">{department.value}%</span>
          </div>
        )) : (
          <div className="col-span-2 text-center text-gray-500">No department data available</div>
        )}
      </div>
    </div>
  );
}
