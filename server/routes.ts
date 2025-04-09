import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAppointmentSchema, insertHealthMetricSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users API
  app.get('/api/users/current', async (req, res) => {
    // In a real app, this would use session management
    const user = await storage.getUser(1);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't expose password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  // Doctors API
  app.get('/api/doctors', async (req, res) => {
    const doctors = await storage.getDoctors();
    res.json(doctors);
  });
  
  app.get('/api/doctors/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }
    
    const doctor = await storage.getDoctor(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  });
  
  // Patients API
  app.get('/api/patients', async (req, res) => {
    const patients = await storage.getPatients();
    res.json(patients);
  });
  
  app.get('/api/patients/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }
    
    const patient = await storage.getPatient(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  });
  
  // Appointments API
  app.get('/api/appointments', async (req, res) => {
    const doctorId = req.query.doctorId ? parseInt(req.query.doctorId as string) : undefined;
    const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
    
    let appointments;
    if (doctorId) {
      appointments = await storage.getAppointmentsByDoctor(doctorId);
    } else if (patientId) {
      appointments = await storage.getAppointmentsByPatient(patientId);
    } else {
      appointments = await storage.getAppointments();
    }
    
    res.json(appointments);
  });
  
  app.get('/api/appointments/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    
    const appointment = await storage.getAppointment(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(appointment);
  });
  
  app.post('/api/appointments', async (req, res) => {
    try {
      const appointment = insertAppointmentSchema.parse(req.body);
      const created = await storage.createAppointment(appointment);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid appointment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating appointment' });
    }
  });
  
  app.patch('/api/appointments/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    
    try {
      const updatedAppointment = await storage.updateAppointment(id, req.body);
      if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: 'Error updating appointment' });
    }
  });
  
  app.delete('/api/appointments/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    
    const deleted = await storage.deleteAppointment(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(204).end();
  });
  
  // Departments API
  app.get('/api/departments', async (req, res) => {
    const departments = await storage.getDepartments();
    res.json(departments);
  });
  
  // Visits API
  app.get('/api/visits', async (req, res) => {
    const doctorId = req.query.doctorId ? parseInt(req.query.doctorId as string) : undefined;
    const patientId = req.query.patientId ? parseInt(req.query.patientId as string) : undefined;
    
    let visits;
    if (doctorId) {
      visits = await storage.getVisitsByDoctor(doctorId);
    } else if (patientId) {
      visits = await storage.getVisitsByPatient(patientId);
    } else {
      visits = await storage.getVisits();
    }
    
    res.json(visits);
  });
  
  // Health Metrics API
  app.get('/api/patients/:id/health-metrics', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }
    
    const metrics = await storage.getHealthMetrics(id);
    res.json(metrics);
  });
  
  app.post('/api/patients/:id/health-metrics', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid patient ID' });
    }
    
    try {
      const metric = insertHealthMetricSchema.parse({
        ...req.body,
        patientId: id
      });
      
      const created = await storage.createHealthMetric(metric);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid health metric data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating health metric' });
    }
  });
  
  app.get('/api/dashboard/stats', async (req, res) => {
    const appointments = await storage.getAppointments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === today.getTime();
    });
    
    const completedToday = todayAppointments.filter(appointment => 
      appointment.status === 'completed'
    ).length;
    
    const patients = await storage.getPatients();
    const visits = await storage.getVisits();
    
    const thisMonth = today.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    
    const thisMonthVisits = visits.filter(visit => {
      const visitDate = new Date(visit.date);
      return visitDate.getMonth() === thisMonth;
    }).length;
    
    const lastMonthVisits = visits.filter(visit => {
      const visitDate = new Date(visit.date);
      return visitDate.getMonth() === lastMonth;
    }).length;
    
    res.json({
      todayAppointments: todayAppointments.length,
      remainingAppointments: todayAppointments.length - completedToday,
      patientVisits: {
        thisMonth: thisMonthVisits,
        lastMonth: lastMonthVisits,
        change: thisMonthVisits - lastMonthVisits
      },
      avgTreatmentTime: 32,
      patientSatisfaction: 4.8
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
