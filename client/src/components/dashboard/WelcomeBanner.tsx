import { Download, Calendar, LineChart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import dashboardImage from "@assets/SaveInsta.App_455647383_866013168292275_7988401194850199636_n.jpg";

interface WelcomeBannerProps {
  userName: string;
  onExportReport: () => void;
}

export default function WelcomeBanner({ userName, onExportReport }: WelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-xl text-white p-6 md:p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden relative shadow-xl">
      {/* Enhanced Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full opacity-20 transform translate-x-32 -translate-y-16 blur-xl"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-300 rounded-full opacity-10 blur-md"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 rounded-full opacity-15 transform -translate-x-16 translate-y-8 blur-lg"></div>
      <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-10 blur-md"></div>
      
      {/* Decorative Icons */}
      <div className="absolute top-6 right-1/4 text-white/10 transform rotate-15">
        <Activity className="w-10 h-10" />
      </div>
      <div className="absolute bottom-8 left-1/3 text-white/5 transform -rotate-12">
        <LineChart className="w-12 h-12" />
      </div>

      <div className="relative z-10 w-full md:w-auto mb-6 md:mb-0">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">Welcome Back, {userName}!</h1>
        <p className="text-blue-50 mt-3 text-lg md:max-w-lg">Here's what's happening with your patients today</p>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 mt-8">
          <Button
            variant="secondary"
            className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium px-6 py-5 text-sm rounded-lg"
          >
            <Calendar className="h-5 w-5 mr-2 stroke-[2]" />
            Check Calendar
          </Button>
          <Button
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all duration-300 shadow-md hover:shadow-lg font-medium px-6 py-5 text-sm rounded-lg"
            onClick={onExportReport}
          >
            <Download className="h-5 w-5 mr-2 stroke-[2]" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center z-10 transform transition-all duration-500 hover:scale-105 hover:rotate-1">
        <div className="relative">
          <img 
            src={dashboardImage}
            alt="Medical dashboard" 
            className="h-60 w-auto rounded-lg shadow-2xl object-cover border-4 border-white/20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-transparent rounded-lg"></div>
          
          {/* Subtle reflective effect */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-8 bg-black/20 blur-xl rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
