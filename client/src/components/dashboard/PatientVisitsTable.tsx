import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Visit {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  condition: string;
  notes?: string;
  patient?: {
    name: string;
    avatar: string;
    email: string;
  };
  doctor?: {
    name: string;
  };
}

export default function PatientVisitsTable() {
  const [timeFilter, setTimeFilter] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { data: visits = [], isLoading } = useQuery<Visit[]>({
    queryKey: ['/api/visits'],
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['/api/patients'],
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['/api/doctors'],
  });

  // Enrich visits with patient and doctor data
  const enrichedVisits = visits.map(visit => {
    const patient = patients.find(p => p.id === visit.patientId);
    const doctor = doctors.find(d => d.id === visit.doctorId);
    return {
      ...visit,
      patient,
      doctor
    };
  });

  // Apply filters
  const filteredVisits = enrichedVisits.filter(visit => {
    const visitDate = new Date(visit.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (timeFilter) {
      case "today":
        return visitDate.getTime() === today.getTime();
      case "thisWeek": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return visitDate >= weekStart && visitDate <= today;
      }
      case "thisMonth": {
        return visitDate.getMonth() === today.getMonth() && 
               visitDate.getFullYear() === today.getFullYear();
      }
      default:
        return true;
    }
  });

  // Paginate visits
  const paginatedVisits = filteredVisits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);

  const getConditionStyle = (condition: string) => {
    if (condition.toLowerCase().includes('mumps')) return 'bg-yellow-100 text-yellow-800';
    if (condition.toLowerCase().includes('depression')) return 'bg-blue-100 text-blue-800';
    if (condition.toLowerCase().includes('arthritis')) return 'bg-red-100 text-red-800';
    if (condition.toLowerCase().includes('fracture')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">Recent Patient Visits</h3>
        <Select defaultValue={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[120px] bg-gray-100 text-sm">
            <SelectValue placeholder="Filter by time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Loading patient visits...</div>
      ) : paginatedVisits.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No visits found for the selected period</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-gray-50 text-gray-600">Name</TableHead>
                <TableHead className="bg-gray-50 text-gray-600">Email</TableHead>
                <TableHead className="bg-gray-50 text-gray-600">Date</TableHead>
                <TableHead className="bg-gray-50 text-gray-600">Visit time</TableHead>
                <TableHead className="bg-gray-50 text-gray-600">Doctors</TableHead>
                <TableHead className="bg-gray-50 text-gray-600">Conditions</TableHead>
                <TableHead className="bg-gray-50 text-gray-600 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <img 
                        src={visit.patient?.avatar} 
                        alt={visit.patient?.name} 
                        className="h-8 w-8 rounded-full" 
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-800">{visit.patient?.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{visit.patient?.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {format(new Date(visit.date), 'M/d/yy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{visit.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">{visit.doctor?.name}</div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                      getConditionStyle(visit.condition)
                    )}>
                      {visit.condition}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-blue-600">
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredVisits.length)}
              </span> of <span className="font-medium">{filteredVisits.length}</span> results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
