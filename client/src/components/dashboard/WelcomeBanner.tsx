import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import healthcareImage from "@assets/SaveInsta.App_455647383_866013168292275_7988401194850199636_n.jpg";

interface WelcomeBannerProps {
  userName: string;
  onExportReport: () => void;
}

export default function WelcomeBanner({ userName, onExportReport }: WelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl text-white p-6 mb-6 flex items-center justify-between overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-20 transform translate-x-32 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 rounded-full opacity-10 transform -translate-x-16 translate-y-8"></div>
      <div className="relative z-10">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome Back, {userName}!</h1>
        <p className="opacity-90 mt-2 text-blue-50">Here's what's happening with your patients today</p>
        <div className="flex flex-wrap sm:flex-nowrap gap-3 mt-6">
          <Button
            variant="secondary"
            className="bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow-sm font-medium px-5"
          >
            <Calendar className="h-4 w-4 mr-2 stroke-[2.5]" />
            Check Calendar
          </Button>
          <Button
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-sm font-medium px-5"
            onClick={onExportReport}
          >
            <Download className="h-4 w-4 mr-2 stroke-[2.5]" />
            Export Report
          </Button>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center">
        <div className="relative">
          <img 
            src={healthcareImage} 
            alt="Medical dashboard" 
            className="h-52 rounded-lg shadow-lg object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
