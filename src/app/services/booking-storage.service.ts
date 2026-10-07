import { Injectable, signal, computed } from '@angular/core';
import { BookingAppointment, ServiceItem, BarberStaff } from '../models/barber.models';
import { AudioService } from './audio.service';

@Injectable({
  providedIn: 'root'
})
export class BookingStorageService {
  private readonly STORAGE_KEY = 'navalha_ouro_appointments_v1';
  private readonly USER_KEY = 'navalha_ouro_user_v1';

  // Signals para reatividade pura do Angular 18
  readonly appointments = signal<BookingAppointment[]>([]);
  readonly isBookingModalOpen = signal<boolean>(false);
  readonly isAuthModalOpen = signal<boolean>(false);
  readonly selectedService = signal<ServiceItem | null>(null);
  readonly selectedBarber = signal<BarberStaff | null>(null);
  readonly currentUser = signal<{ name: string; email: string; phone: string } | null>(null);
  readonly toastMessage = signal<{ title: string; text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Computed
  readonly confirmedCount = computed(() => 
    this.appointments().filter(a => a.status === 'confirmado').length
  );

  constructor(private audioService: AudioService) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.appointments.set(JSON.parse(saved));
      } else {
        // Mock inicial de demonstração
        const initialMock: BookingAppointment[] = [
          {
            id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
            serviceId: 'combo-imperial',
            serviceName: 'Combo Imperial (Cabelo + Barba + Bebida)',
            barberId: 'marcos-silva',
            barberName: 'Marcos "Navalha" Silva',
            date: new Date().toISOString().split('T')[0],
            time: '16:00',
            clientName: 'Raquel Gomes',
            clientPhone: '(11) 99887-6655',
            clientEmail: 'raquel@exemplo.com',
            price: 90,
            status: 'confirmado',
            createdAt: new Date().toISOString()
          }
        ];
        this.appointments.set(initialMock);
        this.saveToStorage(initialMock);
      }

      const savedUser = localStorage.getItem(this.USER_KEY);
      if (savedUser) {
        this.currentUser.set(JSON.parse(savedUser));
      }
    } catch {
      // Ignora erro de serialização
    }
  }

  private saveToStorage(list: BookingAppointment[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignora
    }
  }

  openBookingModal(service?: ServiceItem, barber?: BarberStaff): void {
    this.audioService.playClickSound();
    if (service) this.selectedService.set(service);
    if (barber) this.selectedBarber.set(barber);
    this.isBookingModalOpen.set(true);
  }

  closeBookingModal(): void {
    this.audioService.playClickSound();
    this.isBookingModalOpen.set(false);
  }

  openAuthModal(): void {
    this.audioService.playClickSound();
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal(): void {
    this.audioService.playClickSound();
    this.isAuthModalOpen.set(false);
  }

  saveUser(user: { name: string; email: string; phone: string }): void {
    this.currentUser.set(user);
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch {}
    this.showToast('Bem-vindo!', `Olá, ${user.name}! Conta conectada com sucesso.`, 'success');
  }

  logout(): void {
    this.currentUser.set(null);
    try {
      localStorage.removeItem(this.USER_KEY);
    } catch {}
    this.showToast('Até logo', 'Você saiu da sua conta.', 'info');
  }

  createAppointment(appointment: Omit<BookingAppointment, 'id' | 'createdAt' | 'status'>): BookingAppointment {
    const newBooking: BookingAppointment = {
      ...appointment,
      id: 'BK-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString(),
      status: 'confirmado'
    };

    const updated = [newBooking, ...this.appointments()];
    this.appointments.set(updated);
    this.saveToStorage(updated);

    // Efeito sonoro de vitória / confirmação
    this.audioService.playSuccessSound();

    // Notificação Web se autorizada
    this.triggerBrowserNotification(newBooking);

    this.showToast(
      'Agendamento Confirmado! ✂️',
      `${newBooking.serviceName} com ${newBooking.barberName} para o dia ${newBooking.date} às ${newBooking.time}.`,
      'success'
    );

    return newBooking;
  }

  cancelAppointment(id: string): void {
    const updated = this.appointments().map(item => 
      item.id === id ? { ...item, status: 'cancelado' as const } : item
    );
    this.appointments.set(updated);
    this.saveToStorage(updated);
    this.audioService.playClickSound();
    this.showToast('Agendamento Cancelado', 'Seu agendamento foi cancelado com sucesso.', 'info');
  }

  showToast(title: string, text: string, type: 'success' | 'info' | 'error' = 'info'): void {
    this.toastMessage.set({ title, text, type });
    setTimeout(() => {
      if (this.toastMessage()?.title === title) {
        this.toastMessage.set(null);
      }
    }, 5000);
  }

  clearToast(): void {
    this.toastMessage.set(null);
  }

  private triggerBrowserNotification(booking: BookingAppointment): void {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Barbearia Julius', {
          body: `Agendamento confirmado para ${booking.date} às ${booking.time}! Esperamos por você.`,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Barbearia Julius', {
              body: `Agendamento confirmado para ${booking.date} às ${booking.time}!`,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  }
}
