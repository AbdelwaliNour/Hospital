import { 
  users, type User, type InsertUser,
  doctors, type Doctor, type InsertDoctor,
  patients, type Patient, type InsertPatient,
  appointments, type Appointment, type InsertAppointment,
  departments, type Department, type InsertDepartment,
  visits, type Visit, type InsertVisit,
  healthMetrics, type HealthMetric, type InsertHealthMetric
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Doctors
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  
  // Patients
  getPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  
  // Appointments
  getAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Departments
  getDepartments(): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  
  // Visits
  getVisits(): Promise<Visit[]>;
  getVisit(id: number): Promise<Visit | undefined>;
  getVisitsByDoctor(doctorId: number): Promise<Visit[]>;
  getVisitsByPatient(patientId: number): Promise<Visit[]>;
  createVisit(visit: InsertVisit): Promise<Visit>;
  
  // Health Metrics
  getHealthMetrics(patientId: number): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private doctors: Map<number, Doctor>;
  private patients: Map<number, Patient>;
  private appointments: Map<number, Appointment>;
  private departments: Map<number, Department>;
  private visits: Map<number, Visit>;
  private healthMetrics: Map<number, HealthMetric>;
  
  private userId: number;
  private doctorId: number;
  private patientId: number;
  private appointmentId: number;
  private departmentId: number;
  private visitId: number;
  private healthMetricId: number;

  constructor() {
    this.users = new Map();
    this.doctors = new Map();
    this.patients = new Map();
    this.appointments = new Map();
    this.departments = new Map();
    this.visits = new Map();
    this.healthMetrics = new Map();
    
    this.userId = 1;
    this.doctorId = 1;
    this.patientId = 1;
    this.appointmentId = 1;
    this.departmentId = 1;
    this.visitId = 1;
    this.healthMetricId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }
  
  async getDoctor(id: number): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }
  
  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = this.doctorId++;
    const doctor: Doctor = { ...insertDoctor, id };
    this.doctors.set(id, doctor);
    return doctor;
  }
  
  // Patients
  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }
  
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }
  
  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientId++;
    const patient: Patient = { ...insertPatient, id };
    this.patients.set(id, patient);
    return patient;
  }
  
  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }
  
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
  
  async getAppointmentsByDoctor(doctorId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.doctorId === doctorId
    );
  }
  
  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.patientId === patientId
    );
  }
  
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentId++;
    const appointment: Appointment = { ...insertAppointment, id };
    this.appointments.set(id, appointment);
    return appointment;
  }
  
  async updateAppointment(id: number, appointmentUpdate: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...appointmentUpdate };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }
  
  // Departments
  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }
  
  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }
  
  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const id = this.departmentId++;
    const department: Department = { ...insertDepartment, id };
    this.departments.set(id, department);
    return department;
  }
  
  // Visits
  async getVisits(): Promise<Visit[]> {
    return Array.from(this.visits.values());
  }
  
  async getVisit(id: number): Promise<Visit | undefined> {
    return this.visits.get(id);
  }
  
  async getVisitsByDoctor(doctorId: number): Promise<Visit[]> {
    return Array.from(this.visits.values()).filter(
      visit => visit.doctorId === doctorId
    );
  }
  
  async getVisitsByPatient(patientId: number): Promise<Visit[]> {
    return Array.from(this.visits.values()).filter(
      visit => visit.patientId === patientId
    );
  }
  
  async createVisit(insertVisit: InsertVisit): Promise<Visit> {
    const id = this.visitId++;
    const visit: Visit = { ...insertVisit, id };
    this.visits.set(id, visit);
    return visit;
  }
  
  // Health Metrics
  async getHealthMetrics(patientId: number): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values()).filter(
      metric => metric.patientId === patientId
    );
  }
  
  async createHealthMetric(insertMetric: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.healthMetricId++;
    const metric: HealthMetric = { ...insertMetric, id };
    this.healthMetrics.set(id, metric);
    return metric;
  }
  
  // Initialize with sample data
  private initializeSampleData() {
    // Create sample doctor
    const doctor: Doctor = {
      id: this.doctorId++,
      name: 'Dr. Wade Warren',
      avatar: 'https://randomuser.me/api/portraits/women/87.jpg',
      specialty: 'Cardiologist',
      rating: 49,
      experience: 24,
      email: 'wade.warren@medicare.com',
      phone: '+1 (555) 123-4567',
      availableTimeSlots: [
        { day: '2024-05-20', times: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'] }
      ]
    };
    this.doctors.set(doctor.id, doctor);
    
    // Create sample doctors
    const doctorsList = [
      {
        id: this.doctorId++,
        name: 'Dr. Dianne Russell',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        specialty: 'Pediatrician',
        rating: 48,
        experience: 15,
        email: 'dianne.russell@medicare.com',
        phone: '+1 (555) 234-5678',
        availableTimeSlots: []
      },
      {
        id: this.doctorId++,
        name: 'Dr. Bessie Cooper',
        avatar: 'https://randomuser.me/api/portraits/women/53.jpg',
        specialty: 'Neurologist',
        rating: 47,
        experience: 18,
        email: 'bessie.cooper@medicare.com',
        phone: '+1 (555) 345-6789',
        availableTimeSlots: []
      },
      {
        id: this.doctorId++,
        name: 'Dr. Kathryn Murphy',
        avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
        specialty: 'Dermatologist',
        rating: 46,
        experience: 12,
        email: 'kathryn.murphy@medicare.com',
        phone: '+1 (555) 456-7890',
        availableTimeSlots: []
      },
      {
        id: this.doctorId++,
        name: 'Dr. Jerome Bell',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        specialty: 'Orthopedist',
        rating: 45,
        experience: 20,
        email: 'jerome.bell@medicare.com',
        phone: '+1 (555) 567-8901',
        availableTimeSlots: []
      }
    ];
    
    for (const doc of doctorsList) {
      this.doctors.set(doc.id, doc);
    }
    
    // Create sample patients
    const patientsList = [
      {
        id: this.patientId++,
        name: 'Wade Warren',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        email: 'ww@info.com',
        phone: '+1 (555) 987-6543',
        dateOfBirth: new Date('1985-04-12'),
        address: '123 Main St, Anytown, USA',
        medicalConditions: ['Mumps Stage 3'],
        healthMetrics: { heartRate: 78, sleepHours: 7 }
      },
      {
        id: this.patientId++,
        name: 'Cody Fisher',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        email: 'cody@info.com',
        phone: '+1 (555) 876-5432',
        dateOfBirth: new Date('1992-07-23'),
        address: '456 Oak Ave, Somewhere, USA',
        medicalConditions: ['Depression'],
        healthMetrics: { heartRate: 68, sleepHours: 6 }
      },
      {
        id: this.patientId++,
        name: 'Savannah Nguyen',
        avatar: 'https://randomuser.me/api/portraits/women/76.jpg',
        email: 'sav@info.com',
        phone: '+1 (555) 765-4321',
        dateOfBirth: new Date('1988-01-15'),
        address: '789 Pine St, Elsewhere, USA',
        medicalConditions: ['Arthritis'],
        healthMetrics: { heartRate: 72, sleepHours: 8 }
      },
      {
        id: this.patientId++,
        name: 'Jerome Bell',
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        email: 'jer@info.com',
        phone: '+1 (555) 654-3210',
        dateOfBirth: new Date('1976-09-30'),
        address: '101 Cedar Rd, Nowhere, USA',
        medicalConditions: ['Fracture'],
        healthMetrics: { heartRate: 65, sleepHours: 7 }
      }
    ];
    
    for (const patient of patientsList) {
      this.patients.set(patient.id, patient);
    }
    
    // Create sample departments
    const departmentsList = [
      {
        id: this.departmentId++,
        name: 'Cardiology',
        color: '#1366AE',
        staffCount: 15,
        patientCount: 120
      },
      {
        id: this.departmentId++,
        name: 'Neurology',
        color: '#4A90E2',
        staffCount: 12,
        patientCount: 90
      },
      {
        id: this.departmentId++,
        name: 'Dermatology',
        color: '#66B5F8',
        staffCount: 8,
        patientCount: 60
      },
      {
        id: this.departmentId++,
        name: 'Orthopedics',
        color: '#2AB7CA',
        staffCount: 10,
        patientCount: 75
      },
      {
        id: this.departmentId++,
        name: 'Emergency',
        color: '#E74C3C',
        staffCount: 20,
        patientCount: 200
      }
    ];
    
    for (const department of departmentsList) {
      this.departments.set(department.id, department);
    }
    
    // Create sample visits
    const visitsList = [
      {
        id: this.visitId++,
        patientId: 1,
        doctorId: 2,
        date: new Date('2018-04-04'),
        time: '9:00-10:00 PM',
        condition: 'Mumps Stage 3',
        notes: 'Patient showing improvement after medication.'
      },
      {
        id: this.visitId++,
        patientId: 2,
        doctorId: 3,
        date: new Date('2017-07-18'),
        time: '10:00-11:00 PM',
        condition: 'Depression',
        notes: 'Prescribed new medication and therapy sessions.'
      },
      {
        id: this.visitId++,
        patientId: 3,
        doctorId: 4,
        date: new Date('2018-04-06'),
        time: '11:00-12:00 PM',
        condition: 'Arthritis',
        notes: 'Pain management routine established.'
      },
      {
        id: this.visitId++,
        patientId: 4,
        doctorId: 5,
        date: new Date('2016-09-23'),
        time: '1:00-2:00 PM',
        condition: 'Fracture',
        notes: 'Cast applied, follow-up in 4 weeks.'
      }
    ];
    
    for (const visit of visitsList) {
      this.visits.set(visit.id, visit);
    }
    
    // Create sample health metrics
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Heart rate data for patient 1 (hourly for today)
    for (let i = 0; i < 12; i++) {
      const hour = new Date(now);
      hour.setHours(hour.getHours() - i);
      
      const heartRate = 70 + Math.floor(Math.random() * 25); // 70-95 bpm
      
      this.healthMetrics.set(this.healthMetricId++, {
        id: this.healthMetricId,
        patientId: 1,
        timestamp: hour,
        heartRate,
        sleepHours: null,
        bloodPressure: '120/80',
        temperature: 98,
        weight: 170
      });
    }
    
    // Sleep data for patient 1 (monthly)
    for (let i = 0; i < 12; i++) {
      const month = new Date(now);
      month.setMonth(month.getMonth() - i);
      
      const sleepHours = 5 + Math.floor(Math.random() * 4); // 5-8 hours
      
      this.healthMetrics.set(this.healthMetricId++, {
        id: this.healthMetricId,
        patientId: 1,
        timestamp: month,
        heartRate: null,
        sleepHours,
        bloodPressure: null,
        temperature: null,
        weight: null
      });
    }
    
    // Create admin user
    this.users.set(this.userId++, {
      id: 1,
      username: 'admin',
      password: 'admin123',
      name: 'Dr. Zack Williams',
      role: 'admin',
      email: 'zack@medicare.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    });
    
    // Create appointments
    const today = new Date();
    for (let i = 0; i < 8; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setHours(9 + i);
      appointmentDate.setMinutes(0);
      
      this.appointments.set(this.appointmentId++, {
        id: this.appointmentId,
        patientId: (i % 4) + 1,
        doctorId: (i % 5) + 1,
        date: appointmentDate,
        time: `${9 + i}:00 AM`,
        status: i < 5 ? 'completed' : 'scheduled',
        condition: patientsList[i % 4].medicalConditions[0],
        notes: 'Regular checkup'
      });
    }
  }
}

export const storage = new MemStorage();
