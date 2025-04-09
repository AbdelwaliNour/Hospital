import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("thisMonth");
  const [chartTab, setChartTab] = useState("visits");
  
  const { data: visits = [] } = useQuery({
    queryKey: ['/api/visits'],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments'],
  });
  
  // Monthly data preparation
  const currentYear = new Date().getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyVisits = Array(12).fill(0).map((_, index) => {
    const month = index;
    const count = visits.filter(visit => {
      const visitDate = new Date(visit.date);
      return visitDate.getMonth() === month && visitDate.getFullYear() === currentYear;
    }).length;
    
    return {
      name: monthNames[index],
      visits: count,
    };
  });
  
  // Department distribution
  const departmentVisits = departments.map(dept => {
    const deptVisits = visits.filter(visit => {
      const doctor = visit.doctorId; // Normally you would check if the doctor belongs to this department
      return doctor % departments.length === dept.id % departments.length; // Just for demo
    }).length;
    
    return {
      name: dept.name,
      value: deptVisits,
      color: dept.color,
    };
  });
  
  // Condition distribution
  const conditions = visits.reduce((acc, visit) => {
    const condition = visit.condition;
    if (!acc[condition]) {
      acc[condition] = 0;
    }
    acc[condition]++;
    return acc;
  }, {} as Record<string, number>);
  
  const conditionData = Object.entries(conditions).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Download report
  const handleDownloadReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      visitsSummary: monthlyVisits,
      departmentSummary: departmentVisits,
      conditionSummary: conditionData,
    };
    
    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Analytics Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{format(new Date(), 'MMMM d, yyyy')}</span>
          </div>
          
          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visits.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {
                monthlyVisits[new Date().getMonth()].visits > monthlyVisits[new Date().getMonth() - 1 < 0 ? 11 : new Date().getMonth() - 1].visits 
                  ? `↑ ${monthlyVisits[new Date().getMonth()].visits - monthlyVisits[new Date().getMonth() - 1 < 0 ? 11 : new Date().getMonth() - 1].visits} from last month`
                  : `↓ ${monthlyVisits[new Date().getMonth() - 1 < 0 ? 11 : new Date().getMonth() - 1].visits - monthlyVisits[new Date().getMonth()].visits} from last month`
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Active Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-gray-500 mt-1">Managing {visits.length} patient visits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Unique Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(conditions).length}</div>
            <p className="text-xs text-gray-500 mt-1">Across all patient visits</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <Tabs defaultValue={chartTab} onValueChange={setChartTab}>
              <TabsList>
                <TabsTrigger value="visits">Patient Visits</TabsTrigger>
                <TabsTrigger value="departments">Department Distribution</TabsTrigger>
                <TabsTrigger value="conditions">Medical Conditions</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="p-6">
          <div className="h-[400px]">
            <Tabs defaultValue={chartTab} value={chartTab}>
              <TabsContent value="visits" className="h-full mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyVisits} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visits" stroke="#1366AE" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="departments" className="h-full mt-0">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="w-full md:w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <Pie
                          data={departmentVisits}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {departmentVisits.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} visits`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2 h-full flex flex-col justify-center">
                    <h3 className="text-lg font-medium mb-4">Department Visits Breakdown</h3>
                    <div className="space-y-2">
                      {departmentVisits.map((dept, index) => (
                        <div key={index} className="flex items-center">
                          <span 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: dept.color }}
                          ></span>
                          <span className="flex-1">{dept.name}</span>
                          <span className="font-medium">{dept.value} visits</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="conditions" className="h-full mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conditionData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Occurrences" fill="#4A90E2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Treatment Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <span className="text-sm text-gray-500">
                      {75 + Math.floor(Math.random() * 20)}% effective
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={cn("h-2.5 rounded-full", `bg-[${dept.color}]`)}
                      style={{ 
                        width: `${75 + Math.floor(Math.random() * 20)}%`,
                        backgroundColor: dept.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Under 18', value: 15 },
                    { name: '18-30', value: 25 },
                    { name: '31-45', value: 30 },
                    { name: '46-60', value: 20 },
                    { name: 'Over 60', value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#1366AE" />
                  <Cell fill="#4A90E2" />
                  <Cell fill="#66B5F8" />
                  <Cell fill="#2AB7CA" />
                  <Cell fill="#F39C12" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
