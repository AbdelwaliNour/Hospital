import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  userName: string;
  onExportReport: () => void;
}

export default function WelcomeBanner({ userName, onExportReport }: WelcomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-blue-500 rounded-xl text-white p-6 mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Welcome Back, {userName}!</h1>
        <p className="opacity-90 mt-2">Here's what happening with your patients today</p>
        <div className="flex gap-4 mt-4">
          <Button
            variant="secondary"
            className="bg-white text-primary hover:bg-opacity-90 transition"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Check Calendar
          </Button>
          <Button
            variant="outline"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-30"
            onClick={onExportReport}
          >
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      <div className="hidden lg:block">
        <img 
          src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg" 
          alt="Medical illustration" 
          className="h-40"
        />
      </div>
    </div>
  );
}
