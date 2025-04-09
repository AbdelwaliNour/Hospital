import { Bell, Search, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

export default function TopBar() {
  const { data: currentUser } = useQuery({
    queryKey: ['/api/users/current'],
    refetchOnWindowFocus: false
  });

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="bg-gray-100 rounded-lg px-3 py-2 hidden md:flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">{format(new Date(), 'EEEE, dd MMM')}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell className="h-6 w-6 text-gray-500" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">3</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-800">{currentUser?.name || 'Dr. Zack Williams'}</p>
            <p className="text-xs text-gray-500">{currentUser?.role || 'Medical Director'}</p>
          </div>
          <img 
            src={currentUser?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} 
            alt="User Avatar" 
            className="h-8 w-8 rounded-full" 
          />
        </div>
      </div>
    </header>
  );
}
