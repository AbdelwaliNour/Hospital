import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

export default function Patients() {
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['/api/patients'],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Patients</h1>
        <Button className="bg-primary hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Loading patients...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Patient</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Medical Condition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <img
                          src={patient.avatar}
                          alt={patient.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <span>{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      {patient.dateOfBirth 
                        ? format(new Date(patient.dateOfBirth), 'MMM d, yyyy') 
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.medicalConditions && patient.medicalConditions.map((condition, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-amber-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
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
