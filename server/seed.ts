import { db } from './db';
import { 
  users, doctors, patients, departments, 
  appointments, visits, healthMetrics 
} from '@shared/schema';

async function seed() {
  try {
    console.log('Starting seed process...');
    
    // Delete existing data
    await db.delete(healthMetrics);
    await db.delete(visits);
    await db.delete(appointments);
    await db.delete(patients);
    await db.delete(doctors);
    await db.delete(departments);
    await db.delete(users);
    
    console.log('Existing data deleted');
    
    // Create admin user
    const [adminUser] = await db.insert(users).values({
      username: 'admin',
      password: 'admin123',
      name: 'Dr. Zack Williams',
      role: 'admin',
      email: 'zack@medicare.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }).returning();
    
    console.log('Admin user created:', adminUser.username);
    
    // Create doctors
    const doctorEntries = [
      {
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
      },
      {
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
    
    const createdDoctors = await db.insert(doctors).values(doctorEntries).returning();
    console.log(`${createdDoctors.length} doctors created`);
    
    // Create patients
    const patientEntries = [
      {
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
    
    const createdPatients = await db.insert(patients).values(patientEntries).returning();
    console.log(`${createdPatients.length} patients created`);
    
    // Create departments
    const departmentEntries = [
      {
        name: 'Cardiology',
        color: '#1366AE',
        staffCount: 15,
        patientCount: 120
      },
      {
        name: 'Neurology',
        color: '#4A90E2',
        staffCount: 12,
        patientCount: 90
      },
      {
        name: 'Dermatology',
        color: '#66B5F8',
        staffCount: 8,
        patientCount: 60
      },
      {
        name: 'Orthopedics',
        color: '#2AB7CA',
        staffCount: 10,
        patientCount: 75
      },
      {
        name: 'Emergency',
        color: '#E74C3C',
        staffCount: 20,
        patientCount: 200
      }
    ];
    
    const createdDepartments = await db.insert(departments).values(departmentEntries).returning();
    console.log(`${createdDepartments.length} departments created`);
    
    // Create visits
    const visitEntries = [
      {
        patientId: createdPatients[0].id,
        doctorId: createdDoctors[1].id,
        date: new Date('2018-04-04'),
        time: '9:00-10:00 PM',
        condition: 'Mumps Stage 3',
        notes: 'Patient showing improvement after medication.'
      },
      {
        patientId: createdPatients[1].id,
        doctorId: createdDoctors[2].id,
        date: new Date('2017-07-18'),
        time: '10:00-11:00 PM',
        condition: 'Depression',
        notes: 'Prescribed new medication and therapy sessions.'
      },
      {
        patientId: createdPatients[2].id,
        doctorId: createdDoctors[3].id,
        date: new Date('2018-04-06'),
        time: '11:00-12:00 PM',
        condition: 'Arthritis',
        notes: 'Pain management routine established.'
      },
      {
        patientId: createdPatients[3].id,
        doctorId: createdDoctors[4].id,
        date: new Date('2016-09-23'),
        time: '1:00-2:00 PM',
        condition: 'Fracture',
        notes: 'Cast applied, follow-up in 4 weeks.'
      }
    ];
    
    const createdVisits = await db.insert(visits).values(visitEntries).returning();
    console.log(`${createdVisits.length} visits created`);
    
    // Create health metrics
    const now = new Date();
    const healthMetricEntries = [];
    
    // Heart rate data for patient 1 (hourly for today)
    for (let i = 0; i < 12; i++) {
      const hour = new Date(now);
      hour.setHours(hour.getHours() - i);
      
      const heartRate = 70 + Math.floor(Math.random() * 25); // 70-95 bpm
      
      healthMetricEntries.push({
        patientId: createdPatients[0].id,
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
      
      healthMetricEntries.push({
        patientId: createdPatients[0].id,
        timestamp: month,
        heartRate: null,
        sleepHours,
        bloodPressure: null,
        temperature: null,
        weight: null
      });
    }
    
    const createdHealthMetrics = await db.insert(healthMetrics).values(healthMetricEntries).returning();
    console.log(`${createdHealthMetrics.length} health metrics created`);
    
    // Create appointments
    const today = new Date();
    const appointmentEntries = [];
    
    for (let i = 0; i < 8; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setHours(9 + i);
      appointmentDate.setMinutes(0);
      
      appointmentEntries.push({
        patientId: createdPatients[i % createdPatients.length].id,
        doctorId: createdDoctors[i % createdDoctors.length].id,
        date: appointmentDate,
        time: `${9 + i}:00 AM`,
        status: i < 5 ? 'completed' : 'scheduled',
        condition: patientEntries[i % patientEntries.length].medicalConditions[0],
        notes: 'Regular checkup'
      });
    }
    
    const createdAppointments = await db.insert(appointments).values(appointmentEntries).returning();
    console.log(`${createdAppointments.length} appointments created`);
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed function
seed();