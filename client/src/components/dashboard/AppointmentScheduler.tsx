import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, isToday, isWeekend, isSameDay, parseISO, addDays } from "date-fns";

interface Doctor {
  id: number;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  experience: number;
  availableTimeSlots: Array<{
    day: string;
    times: string[];
  }>;
}

export default function AppointmentScheduler() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const queryClient = useQueryClient();

  const { data: doctors = [] } = useQuery<Doctor[]>({
    queryKey: ['/api/doctors'],
  });

  useEffect(() => {
    // Generate calendar dates (42 days - 6 weeks)
    const dates: Date[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 3); // Start 3 days ago
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    
    setCalendarDates(dates);
    
    // Set first doctor as default
    if (doctors.length > 0 && !selectedDoctor) {
      setSelectedDoctor(doctors[0]);
    }
  }, [doctors, selectedDoctor]);

  const filteredTimeSlots = selectedDoctor?.availableTimeSlots.find(
    slot => slot.day === format(selectedDate, 'yyyy-MM-dd')
  )?.times || [];

  const createAppointment = useMutation({
    mutationFn: async () => {
      if (!selectedDoctor || !selectedTime) {
        throw new Error('Please select a doctor and time');
      }
      
      return apiRequest('POST', '/api/appointments', {
        patientId: 1, // Assuming current logged-in user
        doctorId: selectedDoctor.id,
        date: selectedDate.toISOString(),
        time: selectedTime,
        status: 'scheduled',
        condition: '',
        notes: ''
      });
    },
    onSuccess: () => {
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${selectedDoctor?.name} at ${selectedTime} on ${format(selectedDate, 'MMMM d, yyyy')} has been booked.`,
      });
      
      // Reset time selection
      setSelectedTime(null);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to book appointment: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleBookAppointment = () => {
    if (!selectedDoctor) {
      toast({
        title: "Error",
        description: "Please select a doctor",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedTime) {
      toast({
        title: "Error",
        description: "Please select a time slot",
        variant: "destructive"
      });
      return;
    }
    
    createAppointment.mutate();
  };

  const isDayUnavailable = (date: Date) => {
    // Weekend or past days are unavailable
    if (isWeekend(date) || date < new Date()) {
      return true;
    }
    
    // Assuming doctor might not be available on certain days
    // This would normally be checked against the doctor's actual availability
    return false;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-primary text-white p-5">
        <h3 className="text-lg font-semibold">Doctor's Appointment</h3>
        <div className="relative mt-3">
          <Input
            type="text"
            placeholder="Search doctor"
            className="w-full px-4 py-2 rounded-lg pl-10 text-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary cursor-pointer" />
        </div>
      </div>
      
      {selectedDoctor && (
        <div className="p-5 bg-blue-50 border-b flex items-center">
          <img 
            src={selectedDoctor.avatar} 
            alt={selectedDoctor.name} 
            className="w-12 h-12 rounded-full object-cover" 
          />
          <div className="ml-3 flex-1">
            <h4 className="text-gray-800 font-medium">{selectedDoctor.name}</h4>
            <p className="text-sm text-gray-600">{format(selectedDate, 'MMMM d, yyyy')}</p>
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center text-gray-800 bg-gray-100 rounded-full py-1 px-2">
              <span className="text-xs font-medium">+{selectedDoctor.rating * 2}</span>
            </div>
            <div className="flex items-center text-gray-800 bg-gray-100 rounded-full py-1 px-2">
              <span className="text-xs font-medium">+{selectedDoctor.experience} Years</span>
            </div>
            <div className="flex items-center text-gray-800 bg-gray-100 rounded-full py-1 px-2">
              <span className="text-xs font-medium">{selectedDoctor.rating / 10}({selectedDoctor.rating})</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-5 flex-1 overflow-y-auto">
        <h4 className="font-semibold text-gray-800 mb-3">Select Date</h4>
        
        <div className="grid grid-cols-7 gap-2 text-center mb-6">
          <div className="text-xs text-gray-600 font-medium">Sun</div>
          <div className="text-xs text-gray-600 font-medium">Mon</div>
          <div className="text-xs text-gray-600 font-medium">Tue</div>
          <div className="text-xs text-gray-600 font-medium">Wed</div>
          <div className="text-xs text-gray-600 font-medium">Thu</div>
          <div className="text-xs text-gray-600 font-medium">Fri</div>
          <div className="text-xs text-gray-600 font-medium">Sat</div>
          
          {calendarDates.map((date, index) => (
            <div
              key={index}
              className={cn(
                "py-2 rounded-lg text-sm cursor-pointer transition-colors",
                isDayUnavailable(date) 
                  ? "text-gray-300 cursor-not-allowed" 
                  : isSameDay(date, selectedDate)
                    ? "bg-primary text-white"
                    : "hover:bg-blue-50"
              )}
              onClick={() => !isDayUnavailable(date) && setSelectedDate(date)}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-xs mb-3">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-primary mr-1"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-gray-300 mr-1"></span>
            <span>Full Booked</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-gray-200 mr-1"></span>
            <span>Not Available</span>
          </div>
        </div>
        
        <h4 className="font-semibold text-gray-800 mt-6 mb-3">Select Time</h4>
        
        {filteredTimeSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 mb-6">
            {filteredTimeSlots.map((time, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg py-2 text-center cursor-pointer transition-colors",
                  selectedTime === time
                    ? "bg-primary text-white"
                    : "hover:bg-blue-50"
                )}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No available time slots for selected date
          </div>
        )}
      </div>
      
      <div className="p-5 border-t">
        <Button 
          className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition"
          disabled={!selectedTime || createAppointment.isPending}
          onClick={handleBookAppointment}
        >
          {createAppointment.isPending ? "Booking..." : "Book Appointment"}
        </Button>
      </div>
    </div>
  );
}
