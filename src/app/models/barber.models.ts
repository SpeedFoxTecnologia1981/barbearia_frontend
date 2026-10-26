export interface ServiceItem {
  id: number;
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
  id: number;
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
  id: number;
  /** Código exibido ao cliente, ex.: AG-0012 */
  code: string;
  serviceName: string;
  barberName: string;
  /** yyyy-MM-dd */
  date: string;
  /** HH:mm */
  time: string;
  clientName: string;
  price: number;
  status: 'confirmado' | 'cancelado' | 'concluido';
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
