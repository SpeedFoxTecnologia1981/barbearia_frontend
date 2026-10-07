export interface ServiceItem {
  id: string;
  name: string;
  category: 'cabelo' | 'barba' | 'combos' | 'tratamento';
  durationMinutes: number;
  price: number;
  description: string;
  popular?: boolean;
  image?: string;
  icon?: string;
}

export interface BarberStaff {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  rating: number;
  totalReviews: number;
  photo: string;
  bio: string;
  specialties: string[];
}

export interface BookingAppointment {
  id: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  notes?: string;
  price: number;
  status: 'confirmado' | 'cancelado' | 'concluido';
  createdAt: string;
}

export interface ClientTestimonial {
  id: string;
  name: string;
  clientRole: string;
  rating: number;
  comment: string;
  date: string;
  avatarInitial: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}
