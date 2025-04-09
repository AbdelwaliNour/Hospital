import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  email: text("email"),
  avatar: text("avatar"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Doctor schema
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  specialty: text("specialty").notNull(),
  rating: integer("rating"),
  experience: integer("experience"),
  email: text("email"),
  phone: text("phone"),
  availableTimeSlots: json("available_time_slots").notNull(),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
});

// Patient schema
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  address: text("address"),
  medicalConditions: json("medical_conditions"),
  healthMetrics: json("health_metrics"),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
});

// Appointment schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  status: text("status").notNull(),
  condition: text("condition"),
  notes: text("notes"),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
});

// Department schema
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  staffCount: integer("staff_count").notNull(),
  patientCount: integer("patient_count").notNull(),
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

// Visit schema
export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  condition: text("condition").notNull(),
  notes: text("notes"),
});

export const insertVisitSchema = createInsertSchema(visits).omit({
  id: true,
});

// Health Metrics schema
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  heartRate: integer("heart_rate"),
  sleepHours: integer("sleep_hours"),
  bloodPressure: text("blood_pressure"),
  temperature: integer("temperature"),
  weight: integer("weight"),
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({
  id: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Visit = typeof visits.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;

export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
