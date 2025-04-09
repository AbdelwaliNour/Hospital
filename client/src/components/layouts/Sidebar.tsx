import { Link, useLocation } from "wouter";
import { 
  Home, 
  Users, 
  Calendar, 
  BarChart2, 
  UserPlus, 
  MessageSquare, 
  Settings as SettingsIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/patients", label: "Patients", icon: Users },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/staff", label: "Staff", icon: UserPlus },
    { href: "/messages", label: "Messages", icon: MessageSquare },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="w-16 lg:w-64 bg-primary shadow-lg flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 lg:h-20 bg-primary">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white flex items-center justify-center">
          <svg className="w-6 h-6 lg:w-8 lg:h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 4c-1.04 0-2.5.16-4.5.16C10 4.16 8.54 4 7.5 4 3.5 4 0 6.12 0 10c0 2.25 2 3.61 4 3.61 2 0 2.5-.63 4.5-.63 1.17 0 1.33.63 3 .63 2 0 4-1.36 4-3.61V6a2 2 0 0 0-2-2h3zm-2.5 6.5A1.5 1.5 0 0 1 12.5 9h-1A1.5 1.5 0 0 1 10 7.5v-1A1.5 1.5 0 0 1 11.5 5h1A1.5 1.5 0 0 1 14 6.5v1z"/>
            <path d="M20 10c-.86 0-1.5 1.15-1.5 1.5v5c0 .36.64 1.5 1.5 1.5s1.5-1.14 1.5-1.5v-5c0-.36-.64-1.5-1.5-1.5zm-14 0c-.86 0-1.5 1.15-1.5 1.5v5c0 .36.64 1.5 1.5 1.5s1.5-1.14 1.5-1.5v-5c0-.36-.64-1.5-1.5-1.5z"/>
          </svg>
        </div>
        <h1 className="ml-3 text-white text-xl font-semibold hidden lg:block">MediCare</h1>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 flex flex-col gap-2 px-2 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex items-center justify-center lg:justify-start px-2 py-3 rounded-lg text-white hover:bg-primary-light transition-colors duration-200",
                location === item.href && "bg-primary-light"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="ml-3 hidden lg:block">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
      
      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center justify-center lg:justify-start text-white">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" className="w-8 h-8 rounded-full" />
          <div className="ml-3 hidden lg:block">
            <p className="text-sm font-medium">Dr. Zack Williams</p>
            <p className="text-xs opacity-75">Medical Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}
