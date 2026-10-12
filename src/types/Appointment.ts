export interface Doctor {
  id: number;
  fullName: string;
  specialty: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Doctor {
  id: number;
  fullName: string;
  specialty: string;
  workStartTime: string;
  workEndTime: string;
  workingDaysCsv: string;
  imageUrl: string | null;
  bio: string | null;
  yearsOfExperience: number | null;
}
export interface CreateAppointmentRequest {
  doctorId: number;
  startTime: string;
  patientPhone: string;
}

export interface AppointmentAdmin {
  id: number;
  doctorName: string;
  patientEmail: string;
  patientPhone: string;
  startTime: string;
  status: string;
}