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
import { AlertTriangle, CalendarIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Define proper types for our data
interface Visit {
  id: number;
  doctorId: number;
  patientId: number;
  date: string;
  condition?: string;
}

interface Department {
  id: number;
  name: string;
  color: string;
}

interface VisitDataPoint {
  name: string;
  visits: number;
}

interface DepartmentVisit {
  name: string;
  value: number;
  color: string;
}

interface ConditionDataPoint {
  name: string;
  value: number;
}

// Component for empty or error states
const EmptyStateMessage = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
    <AlertTriangle className="h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-700">{message}</h3>
    <p className="text-sm text-gray-500 mt-2">
      This could be due to missing data or a connection issue.
    </p>
  </div>
);

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("thisMonth");
  const [chartTab, setChartTab] = useState("visits");
  
  const { data: visits = [], isLoading: visitsLoading, error: visitsError } = useQuery<Visit[]>({
    queryKey: ['/api/visits'],
  });

  const { data: departments = [], isLoading: deptsLoading, error: deptsError } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
  });
  
  // Monthly data preparation with safety checks
  const currentYear = new Date().getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyVisits: VisitDataPoint[] = Array(12).fill(0).map((_, index) => {
    const month = index;
    // Safely filter visits with proper type checking
    const count = Array.isArray(visits) ? visits.filter(visit => {
      if (!visit || !visit.date) return false;
      try {
        const visitDate = new Date(visit.date);
        return visitDate.getMonth() === month && visitDate.getFullYear() === currentYear;
      } catch (e) {
        return false;
      }
    }).length : 0;
    
    return {
      name: monthNames[index],
      visits: count,
    };
  });
  
  // Department distribution with safety checks
  const departmentVisits: DepartmentVisit[] = Array.isArray(departments) && departments.length > 0 ? 
    departments.map(dept => {
      if (!dept || !dept.name || !dept.color) {
        return { name: 'Unknown', value: 0, color: '#cccccc' };
      }
      
      // Safely count visits for each department
      const deptVisits = Array.isArray(visits) ? visits.filter(visit => {
        if (!visit || typeof visit.doctorId !== 'number') return false;
        // Safe version of the department assignment logic
        const deptLength = Array.isArray(departments) ? departments.length : 1;
        return deptLength > 0 && visit.doctorId % deptLength === dept.id % deptLength;
      }).length : 0;
      
      return {
        name: dept.name,
        value: deptVisits,
        color: dept.color,
      };
    }) : [];
  
  // Empty state fallback for department visits
  const hasDepartmentData = Array.isArray(departmentVisits) && departmentVisits.length > 0 && 
    departmentVisits.some(dept => dept.value > 0);
  
  // Safely create conditions object
  const conditions: Record<string, number> = {};
  if (Array.isArray(visits)) {
    visits.forEach(visit => {
      if (visit && visit.condition) {
        const condition = visit.condition;
        if (!conditions[condition]) {
          conditions[condition] = 0;
        }
        conditions[condition]++;
      }
    });
  }
  
  const conditionData: ConditionDataPoint[] = Object.entries(conditions).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Check if we have condition data
  const hasConditionData = conditionData.length > 0;
  
  // Safely calculate monthly visit change
  const currentMonthIndex = new Date().getMonth();
  const previousMonthIndex = currentMonthIndex - 1 < 0 ? 11 : currentMonthIndex - 1;
  
  const currentMonthVisits = monthlyVisits[currentMonthIndex]?.visits || 0;
  const previousMonthVisits = monthlyVisits[previousMonthIndex]?.visits || 0;
  
  const visitChangeText = currentMonthVisits > previousMonthVisits 
    ? `↑ ${currentMonthVisits - previousMonthVisits} from last month`
    : `↓ ${previousMonthVisits - currentMonthVisits} from last month`;
  
  // Download report with safety checks
  const handleDownloadReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      visitsSummary: monthlyVisits || [],
      departmentSummary: departmentVisits || [],
      conditionSummary: conditionData || [],
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
  
  // Loading and error states
  const isLoading = visitsLoading || deptsLoading;
  const hasError = visitsError || deptsError;
  
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
            <div className="text-2xl font-bold">
              {Array.isArray(visits) ? visits.length : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentMonthVisits > 0 || previousMonthVisits > 0 ? visitChangeText : "No visit data available"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Active Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(departments) ? departments.length : 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Managing {Array.isArray(visits) ? visits.length : 0} patient visits
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Unique Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(conditions).length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {Object.keys(conditions).length > 0 
                ? `Across all patient visits` 
                : `No condition data available`}
            </p>
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
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse w-full max-w-md bg-gray-100 h-3/4 rounded"></div>
                  </div>
                ) : hasError ? (
                  <EmptyStateMessage message="Unable to load visit data" />
                ) : monthlyVisits.every(m => m.visits === 0) ? (
                  <EmptyStateMessage message="No visit data available for the selected time range" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyVisits} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="visits" 
                        stroke="#1366AE" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }}
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>
              
              <TabsContent value="departments" className="h-full mt-0">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse w-full max-w-md bg-gray-100 h-3/4 rounded"></div>
                  </div>
                ) : hasError ? (
                  <EmptyStateMessage message="Unable to load department data" />
                ) : !hasDepartmentData ? (
                  <EmptyStateMessage message="No department visit data available" />
                ) : (
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
                            label={({ name, percent }) => 
                              name && percent ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                            isAnimationActive={true}
                          >
                            {departmentVisits.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || '#cccccc'} />
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
                              style={{ backgroundColor: dept.color || '#cccccc' }}
                            ></span>
                            <span className="flex-1">{dept.name || 'Unknown'}</span>
                            <span className="font-medium">{dept.value || 0} visits</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="conditions" className="h-full mt-0">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse w-full max-w-md bg-gray-100 h-3/4 rounded"></div>
                  </div>
                ) : hasError ? (
                  <EmptyStateMessage message="Unable to load condition data" />
                ) : !hasConditionData ? (
                  <EmptyStateMessage message="No condition data available" />
                ) : (
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
                      <Bar 
                        dataKey="value" 
                        name="Occurrences" 
                        fill="#4A90E2" 
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
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
            {!Array.isArray(departments) || departments.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No department data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {departments.map((dept, index) => {
                  if (!dept || !dept.name || !dept.color) return null;
                  
                  const effectivenessValue = 75 + Math.floor(Math.random() * 20);
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-sm text-gray-500">
                          {effectivenessValue}% effective
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
                          style={{ 
                            width: `${effectivenessValue}%`,
                            backgroundColor: dept.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  label={({ name, percent }) => 
                    name && percent ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  isAnimationActive={true}
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
