// Generate random time series data for health metrics charts

/**
 * Generates heart rate data for the dashboard chart
 * @returns Array of data points with time and heart rate values
 */
export function generateHeartRateData() {
  const hourlyData = [];
  const now = new Date();
  
  // Generate data for the past 12 hours
  for (let i = 11; i >= 0; i--) {
    const hour = new Date(now);
    hour.setHours(now.getHours() - i);
    
    // Generate a realistic heart rate between 60-100 bpm with some noise
    const baseRate = 78;  // Average heart rate
    const noise = Math.sin(i / 2) * 15; // Sinusoidal pattern
    const random = Math.random() * 10 - 5; // Random variation ±5
    
    const heartRate = Math.round(baseRate + noise + random);
    
    hourlyData.push({
      time: hour.getHours() + ':00',
      value: heartRate
    });
  }
  
  return hourlyData;
}

/**
 * Generates sleep data for the dashboard chart
 * @returns Array of data points with month and sleep hours
 */
export function generateSleepData() {
  const monthlyData = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate sleep data for each month
  for (let i = 0; i < 12; i++) {
    // Base sleep hours with seasonal variation (more sleep in winter)
    const baseSleep = 7;
    const seasonalVariation = Math.cos((i - 1) * Math.PI / 6) * 0.5; // Less sleep in summer
    const randomVariation = Math.random() * 1 - 0.5; // Random variation ±0.5
    
    const sleepHours = Math.max(5, Math.min(9, baseSleep + seasonalVariation + randomVariation));
    
    monthlyData.push({
      month: monthNames[i],
      hours: parseFloat(sleepHours.toFixed(1))
    });
  }
  
  return monthlyData;
}

/**
 * Generates data for department distribution chart
 * @param departments Array of department objects
 * @returns Array of data points for the pie chart
 */
export function generateDepartmentData(departments: any[]) {
  if (!departments || departments.length === 0) {
    return [
      { name: 'Cardiology', value: 40, color: '#1366AE' },
      { name: 'Neurology', value: 30, color: '#4A90E2' },
      { name: 'Dermatology', value: 20, color: '#66B5F8' },
      { name: 'Orthopedics', value: 10, color: '#2AB7CA' }
    ];
  }

  // Calculate percentages based on patientCount
  const total = departments.reduce((sum, dept) => sum + dept.patientCount, 0);
  
  return departments.map(dept => ({
    name: dept.name,
    value: Math.round((dept.patientCount / total) * 100),
    color: dept.color
  }));
}

/**
 * Generates data for staff distribution chart
 * @param departments Array of department objects
 * @returns Array of data points for the bar chart
 */
export function generateStaffData(departments: any[]) {
  if (!departments || departments.length === 0) {
    return [
      { name: 'Cardiology', value: 20, percentage: 40 },
      { name: 'Neurology', value: 15, percentage: 30 },
      { name: 'Dermatology', value: 10, percentage: 20 },
      { name: 'Orthopedics', value: 5, percentage: 10 }
    ];
  }

  // Calculate percentages based on staffCount
  const total = departments.reduce((sum, dept) => sum + dept.staffCount, 0);
  
  return departments.map(dept => ({
    name: dept.name,
    value: dept.staffCount,
    percentage: Math.round((dept.staffCount / total) * 100)
  }));
}

/**
 * Creates data for appointment statistics
 */
export function generateAppointmentStats() {
  return {
    today: 8,
    remaining: 3,
    growth: "+2 from yesterday"
  };
}

/**
 * Creates patient visit statistics
 */
export function generateVisitStats() {
  return {
    thisMonth: 154,
    lastMonth: 135,
    growth: "+19 from last month"
  };
}
