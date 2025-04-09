import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
    color?: string;
  };
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary bg-opacity-10",
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <div className={cn("p-2 rounded-lg", iconBgColor)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold text-gray-800">{value}</p>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        {trend && (
          <div 
            className={cn(
              "text-sm font-medium flex items-center",
              trend.color || (trend.direction === "up" ? "text-green-600" : "text-red-600")
            )}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={trend.direction === "up" 
                  ? "M5 10l7-7m0 0l7 7m-7-7v18" 
                  : "M19 14l-7 7m0 0l-7-7m7 7V3"} 
              />
            </svg>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
