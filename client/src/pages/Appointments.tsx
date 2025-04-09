import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Appointments() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['/api/patients'],
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ['/api/doctors'],
  });
  
  // Enrich appointments with patient and doctor data
  const enrichedAppointments = appointments.map(appointment => {
    const patient = patients.find(p => p.id === appointment.patientId);
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    return {
      ...appointment,
      patient,
      doctor
    };
  });
  
  // Apply filter
  const filteredAppointments = statusFilter 
    ? enrichedAppointments.filter(appointment => appointment.status === statusFilter)
    : enrichedAppointments;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Appointments</h1>
        <Button className="bg-primary hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex mb-6 space-x-2">
          <Button 
            variant={statusFilter === null ? "default" : "outline"}
            onClick={() => setStatusFilter(null)}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === "scheduled" ? "default" : "outline"}
            onClick={() => setStatusFilter("scheduled")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled
          </Button>
          <Button 
            variant={statusFilter === "completed" ? "default" : "outline"}
            onClick={() => setStatusFilter("completed")}
          >
            <Check className="h-4 w-4 mr-2" />
            Completed
          </Button>
          <Button 
            variant={statusFilter === "cancelled" ? "default" : "outline"}
            onClick={() => setStatusFilter("cancelled")}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelled
          </Button>
        </div>
        
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Loading appointments...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No appointments found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={appointment.patient?.avatar}
                          alt={appointment.patient?.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <span className="font-medium">{appointment.patient?.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.doctor?.name}</TableCell>
                    <TableCell>
                      {format(new Date(appointment.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      {appointment.condition ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {appointment.condition}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "capitalize",
                        appointment.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                        appointment.status === "cancelled" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                        "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      )}>
                        {appointment.status === "scheduled" && <Clock className="h-3 w-3 mr-1" />}
                        {appointment.status === "completed" && <Check className="h-3 w-3 mr-1" />}
                        {appointment.status === "cancelled" && <X className="h-3 w-3 mr-1" />}
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="ml-2">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
