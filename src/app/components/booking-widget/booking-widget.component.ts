import { Component, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberDataService } from '../../services/barber-data.service';
import { BookingStorageService } from '../../services/booking-storage.service';
import { AudioService } from '../../services/audio.service';
import { ApiService } from '../../services/api.service';
import { BookingAppointment, ServiceItem, BarberStaff } from '../../models/barber.models';
import { HorarioApi } from '../../models/api.models';
import { defaultBookingDate, isSunday } from '../../core/date.util';

@Component({
  selector: 'app-booking-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-widget.component.html',
  styleUrl: './booking-widget.component.css'
})
export class BookingWidgetComponent {
  selectedServiceId: number | null = null;
  selectedBarberId: number | null = null;
  selectedDate: string = defaultBookingDate();
  selectedTime: string = '';

  horarios: { hora: string; disponivel: boolean }[] = [];
  carregandoHorarios: boolean = false;
  enviando: boolean = false;

  isSubmitted: boolean = false;
  confirmationData: BookingAppointment | null = null;

  private horariosRequestId = 0;

  constructor(
    public barberData: BarberDataService,
    public bookingStorage: BookingStorageService,
    private api: ApiService,
    private audioService: AudioService
  ) {
    // Seleciona serviço/barbeiro padrão assim que a API responder.
    effect(() => {
      const services = this.barberData.services();
      const barbers = this.barberData.barbers();
      untracked(() => {
        let mudou = false;
        if (this.selectedServiceId === null && services.length > 0) {
          this.selectedServiceId = (services.find(s => s.popular) ?? services[0]).id;
          mudou = true;
        }
        if (this.selectedBarberId === null && barbers.length > 0) {
          this.selectedBarberId = barbers[0].id;
          mudou = true;
        }
        if (mudou) this.carregarHorarios();
      });
    });
  }

  get currentSelectedService(): ServiceItem | undefined {
    return this.barberData.services().find(s => s.id === this.selectedServiceId);
  }

  get currentSelectedBarber(): BarberStaff | undefined {
    return this.barberData.barbers().find(b => b.id === this.selectedBarberId);
  }

  selectTime(time: string): void {
    this.audioService.playClickSound();
    this.selectedTime = time;
  }

  selectService(serviceId: number): void {
    this.audioService.playClickSound();
    this.selectedServiceId = serviceId;
    this.carregarHorarios();
  }

  selectBarber(barberId: number): void {
    this.audioService.playClickSound();
    this.selectedBarberId = barberId;
    this.carregarHorarios();
  }

  onDateChange(date: string): void {
    this.selectedDate = date;
    this.carregarHorarios();
  }

  carregarHorarios(): void {
    if (this.selectedServiceId === null || this.selectedBarberId === null || !this.selectedDate) return;

    const requestId = ++this.horariosRequestId;
    this.carregandoHorarios = true;
    this.api.horarios(this.selectedBarberId, this.selectedServiceId, this.selectedDate).subscribe({
      next: (lista: HorarioApi[]) => {
        if (requestId !== this.horariosRequestId) return;
        this.horarios = lista.map(h => ({ hora: h.hora.slice(0, 5), disponivel: h.disponivel }));
        if (!this.horarios.some(h => h.hora === this.selectedTime && h.disponivel)) {
          this.selectedTime = this.horarios.find(h => h.disponivel)?.hora ?? '';
        }
        this.carregandoHorarios = false;
      },
      error: () => {
        if (requestId !== this.horariosRequestId) return;
        this.horarios = [];
        this.selectedTime = '';
        this.carregandoHorarios = false;
        this.bookingStorage.showToast(
          'Horários indisponíveis',
          'Não foi possível consultar os horários. Verifique se a API está no ar.',
          'error'
        );
      }
    });
  }

  submitBooking(): void {
    if (!this.bookingStorage.currentUser()) {
      this.bookingStorage.requireLogin();
      return;
    }

    if (this.selectedDate && isSunday(this.selectedDate)) {
      alert('Aos Domingos estamos fechados! Por favor, selecione uma data de Segunda a Sábado.');
      return;
    }

    if (this.selectedServiceId === null || this.selectedBarberId === null || !this.selectedTime) {
      this.bookingStorage.showToast('Atenção', 'Escolha serviço, barbeiro, data e horário.', 'error');
      return;
    }

    this.enviando = true;
    this.bookingStorage.createAppointment({
      barbeiroId: this.selectedBarberId,
      servicoId: this.selectedServiceId,
      data: this.selectedDate,
      hora: this.selectedTime
    }).subscribe({
      next: (agendamento) => {
        this.enviando = false;
        this.confirmationData = agendamento;
        this.isSubmitted = true;
      },
      error: () => {
        this.enviando = false;
        this.carregarHorarios(); // o horário pode ter sido ocupado por outra pessoa
      }
    });
  }

  resetBookingForm(): void {
    this.audioService.playClickSound();
    this.isSubmitted = false;
    this.confirmationData = null;
    this.carregarHorarios();
  }
}
