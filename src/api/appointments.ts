import { axiosClient } from './axiosClient';
import type { Doctor, TimeSlot, CreateAppointmentRequest } from '../types/Appointment';
import type { AppointmentAdmin } from '../types/Appointment';

export async function getDoctors(): Promise<Doctor[]> {
  const response = await axiosClient.get<Doctor[]>('/Doctors');
  return response.data;
}

export async function getAvailableSlots(doctorId: number, date: string): Promise<TimeSlot[]> {
  const response = await axiosClient.get<TimeSlot[]>('/Appointments/available-slots', {
    params: { doctorId, date },
  });
  return response.data;
}

export async function createAppointment(data: CreateAppointmentRequest): Promise<{ id: number }> {
  const response = await axiosClient.post<{ id: number }>('/Appointments', data);
  return response.data;
}

export interface DoctorPayload {
  fullName: string;
  specialty: string;
  workStartTime: string;
  workEndTime: string;
  workingDaysCsv: string;
  imageUrl: string | null;
  bio: string | null;
  yearsOfExperience: number | null;
}

export async function createDoctor(data: DoctorPayload) {
  const response = await axiosClient.post('/Doctors', data);
  return response.data;
}

export async function updateDoctor(id: number, data: DoctorPayload) {
  await axiosClient.put(`/Doctors/${id}`, data);
}

export async function deleteDoctor(id: number) {
  await axiosClient.delete(`/Doctors/${id}`);
}


export async function getAllAppointments(): Promise<AppointmentAdmin[]> {
  const response = await axiosClient.get<AppointmentAdmin[]>('/Appointments');
  return response.data;
}

export async function cancelAppointment(id: number) {
  await axiosClient.post(`/Appointments/${id}/cancel`);
}
export async function updateAppointmentStatus(id: number, status: string) {
  await axiosClient.put(`/Appointments/${id}/status`, { status });
}
export async function confirmAppointment(token: string) {
  await axiosClient.post('/Appointments/confirm', { token });
}