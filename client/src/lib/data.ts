import { Doctor, Patient, Department, Visit } from "@shared/schema";

/**
 * Formats appointment count with remaining appointments
 * @param total Total appointments
 * @param completed Completed appointments
 * @returns Formatted string
 */
export function formatAppointmentCount(total: number, completed: number): string {
  const remaining = total - completed;
  return `${remaining} remaining`;
}

/**
 * Gets the appropriate color for a medical condition badge
 * @param condition Medical condition
 * @returns CSS class for badge color
 */
export function getConditionBadgeColor(condition: string): string {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('mumps') || conditionLower.includes('fever')) {
    return 'bg-yellow-100 text-yellow-800';
  } else if (conditionLower.includes('depression') || conditionLower.includes('anxiety')) {
    return 'bg-blue-100 text-blue-800';
  } else if (conditionLower.includes('arthritis') || conditionLower.includes('pain')) {
    return 'bg-red-100 text-red-800';
  } else if (conditionLower.includes('fracture') || conditionLower.includes('injury')) {
    return 'bg-green-100 text-green-800';
  } else if (conditionLower.includes('heart') || conditionLower.includes('cardiac')) {
    return 'bg-purple-100 text-purple-800';
  } else if (conditionLower.includes('diabetes') || conditionLower.includes('thyroid')) {
    return 'bg-indigo-100 text-indigo-800';
  } else if (conditionLower.includes('allergy') || conditionLower.includes('asthma')) {
    return 'bg-orange-100 text-orange-800';
  }
  
  return 'bg-gray-100 text-gray-800';
}

/**
 * Formats appointment status for display
 * @param status Appointment status
 * @returns Object with color and icon name
 */
export function getAppointmentStatusInfo(status: string): { color: string, iconName: string } {
  switch (status.toLowerCase()) {
    case 'completed':
      return { color: 'bg-green-100 text-green-800', iconName: 'check' };
    case 'cancelled':
      return { color: 'bg-red-100 text-red-800', iconName: 'x' };
    case 'rescheduled':
      return { color: 'bg-yellow-100 text-yellow-800', iconName: 'refresh-cw' };
    case 'scheduled':
    default:
      return { color: 'bg-blue-100 text-blue-800', iconName: 'clock' };
  }
}

/**
 * Enriches visit data with patient and doctor information
 * @param visits Visit data
 * @param patients Patient data
 * @param doctors Doctor data
 * @returns Enriched visit objects
 */
export function enrichVisitData(
  visits: Visit[],
  patients: Patient[],
  doctors: Doctor[]
): (Visit & { patient?: Patient, doctor?: Doctor })[] {
  return visits.map(visit => {
    const patient = patients.find(p => p.id === visit.patientId);
    const doctor = doctors.find(d => d.id === visit.doctorId);
    return {
      ...visit,
      patient,
      doctor
    };
  });
}

/**
 * Groups visits by department
 * @param visits Visit data
 * @param doctors Doctor data
 * @param departments Department data
 * @returns Map of department to visit count
 */
export function getVisitsByDepartment(
  visits: Visit[],
  doctors: Doctor[],
  departments: Department[]
): Map<string, number> {
  const departmentMap = new Map<string, number>();
  
  // Initialize departments with zero visits
  departments.forEach(dept => {
    departmentMap.set(dept.name, 0);
  });
  
  // Count visits by department
  visits.forEach(visit => {
    const doctor = doctors.find(d => d.id === visit.doctorId);
    if (doctor) {
      const deptName = doctor.specialty;
      if (departmentMap.has(deptName)) {
        departmentMap.set(deptName, departmentMap.get(deptName)! + 1);
      }
    }
  });
  
  return departmentMap;
}

/**
 * Get appointment time slots for a specific date
 * @param doctor Doctor object
 * @param date Date to check
 * @returns Array of available time slots
 */
export function getAvailableTimeSlots(doctor: Doctor, date: Date): string[] {
  const formattedDate = date.toISOString().split('T')[0];
  
  const availableSlot = doctor.availableTimeSlots?.find(
    slot => slot.day === formattedDate
  );
  
  return availableSlot?.times || [];
}

/**
 * Get the first name from a full name
 * @param fullName Full name string
 * @returns First name
 */
export function getFirstName(fullName: string): string {
  return fullName.split(' ')[0];
}
