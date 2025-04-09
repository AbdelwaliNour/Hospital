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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Search, UserCog, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  
  // Use the doctors endpoint as staff
  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['/api/doctors'],
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['/api/departments'],
  });

  // Filter staff by department and search term
  const filteredStaff = staff.filter(doctor => {
    const matchesDepartment = !departmentFilter || 
      departmentFilter === "all" ||
      doctor.specialty.toLowerCase() === departmentFilter.toLowerCase();
    
    const matchesSearch = !searchTerm || 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDepartment && matchesSearch;
  });

  // Staff by department for stats
  const staffByDepartment = departments.map(dept => {
    const count = staff.filter(doctor => 
      doctor.specialty.toLowerCase() === dept.name.toLowerCase()
    ).length;
    
    return {
      department: dept.name,
      count,
      color: dept.color
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Medical Staff</h1>
        <Button className="bg-primary hover:bg-blue-600">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Staff
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{staff.length}</p>
          </CardContent>
        </Card>
        
        {staffByDepartment.slice(0, 3).map((dept, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{dept.department}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: dept.color }}
                />
                <p className="text-2xl font-bold">{dept.count}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search staff..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={departmentFilter || ""} onValueChange={(value) => setDepartmentFilter(value || null)}>
            <SelectTrigger className="w-full md:w-60">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Loading staff data...</div>
        ) : filteredStaff.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No staff members found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-xs text-gray-500">ID: {doctor.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                        )}
                      >
                        {doctor.specialty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          <span>{doctor.email}</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          <span>{doctor.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-medium">{doctor.experience}</span>
                        <span className="text-gray-500 ml-1">years</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-4 w-4 ${star <= Math.round(doctor.rating / 10) ? "text-yellow-400" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 15.934l-6.18 3.254a1 1 0 01-1.447-1.054l1.18-6.892-5-4.874a1 1 0 01.553-1.706l6.905-1.003 3.09-6.253a1 1 0 011.798 0l3.09 6.253 6.905 1.003a1 1 0 01.553 1.706l-5 4.874 1.18 6.892a1 1 0 01-1.447 1.054L10 15.934z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {(doctor.rating / 10).toFixed(1)}/5
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <UserCog className="h-4 w-4" />
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
