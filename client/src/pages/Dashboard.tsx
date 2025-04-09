import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCard from "@/components/dashboard/StatCard";
import HeartRateChart from "@/components/dashboard/HeartRateChart";
import SleepChart from "@/components/dashboard/SleepChart";
import DepartmentChart from "@/components/dashboard/DepartmentChart";
import DepartmentStaff from "@/components/dashboard/DepartmentStaff";
import AppointmentScheduler from "@/components/dashboard/AppointmentScheduler";
import PatientVisitsTable from "@/components/dashboard/PatientVisitsTable";
import { Calendar, Users, Clock, Star } from "lucide-react";
import { generateHeartRateData, generateSleepData } from "@/lib/chartUtils";

export default function Dashboard() {
  const { toast } = useToast();
  
  const { data: currentUser } = useQuery({
    queryKey: ['/api/users/current'],
  });
  
  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });
  
  const { data: departments } = useQuery({
    queryKey: ['/api/departments'],
  });
  
  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Your medical report has been successfully exported to CSV.",
    });
  };
  
  // Generate sample chart data
  const heartRateData = generateHeartRateData();
  const sleepData = generateSleepData();
  
  // Department data for chart
  const departmentChartData = departments?.map(dept => ({
    name: dept.name,
    value: Math.round((dept.patientCount / departments.reduce((sum, d) => sum + d.patientCount, 0)) * 100),
    color: dept.color
  })) || [];
  
  // Department staff data
  const departmentStaffData = departments?.map(dept => ({
    name: dept.name,
    value: dept.staffCount,
    percentage: Math.round((dept.staffCount / departments.reduce((sum, d) => sum + d.staffCount, 0)) * 100)
  })) || [];

  return (
    <>
      {/* Welcome Banner */}
      <WelcomeBanner
        userName={currentUser?.name.split(' ')[1] || 'Doctor'}
        onExportReport={handleExportReport}
      />
      
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Today's Appointments"
          value={dashboardStats?.todayAppointments || 0}
          subtitle={`${dashboardStats?.remainingAppointments || 0} remaining`}
          icon={Calendar}
          trend={{
            value: "+2 from yesterday",
            direction: "up"
          }}
        />
        
        <StatCard
          title="Patient Visits"
          value={dashboardStats?.patientVisits?.thisMonth || 0}
          subtitle="This month"
          icon={Users}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-100"
          trend={{
            value: `+${dashboardStats?.patientVisits?.change || 0} from last month`,
            direction: "up",
            color: "text-green-600"
          }}
        />
        
        <StatCard
          title="Avg. Treatment Time"
          value={`${dashboardStats?.avgTreatmentTime || 0} min`}
          subtitle="Per patient"
          icon={Clock}
          iconColor="text-teal-500"
          iconBgColor="bg-teal-100"
          trend={{
            value: "+4 min from target",
            direction: "down",
            color: "text-yellow-600"
          }}
        />
        
        <StatCard
          title="Patient Satisfaction"
          value={`${dashboardStats?.patientSatisfaction || 0}/5`}
          subtitle="From 100 reviews"
          icon={Star}
          iconColor="text-blue-400"
          iconBgColor="bg-blue-50"
          trend={{
            value: "+0.3 from last month",
            direction: "up",
            color: "text-green-600"
          }}
        />
      </div>
      
      {/* Health Metrics and Appointment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Health Metrics Charts (2 Columns) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <HeartRateChart 
            data={heartRateData} 
            currentBPM={90} 
          />
          
          <SleepChart 
            data={sleepData} 
            averageHours={6} 
          />
          
          <DepartmentChart 
            data={departmentChartData} 
          />
          
          <DepartmentStaff 
            data={departmentStaffData} 
          />
        </div>
        
        {/* Appointment Scheduler */}
        <AppointmentScheduler />
      </div>
      
      {/* Patient Visits Table */}
      <PatientVisitsTable />
    </>
  );
}
