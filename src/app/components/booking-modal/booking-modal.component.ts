import { Component, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingStorageService } from '../../services/booking-storage.service';
import { BarberDataService } from '../../services/barber-data.service';
import { AudioService } from '../../services/audio.service';
import { ApiService } from '../../services/api.service';
import { ServiceItem, BarberStaff } from '../../models/barber.models';
import { defaultBookingDate, isSunday } from '../../core/date.util';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.css'
})
export class BookingModalComponent {
  selectedServiceId: number | null = null;
  selectedBarberId: number | null = null;
  selectedDate: string = defaultBookingDate();
  selectedTime: string = '';

  horarios: { hora: string; disponivel: boolean }[] = [];
  carregandoHorarios: boolean = false;
  enviando: boolean = false;

  isCompleted: boolean = false;
  confirmedCode: string = '';

  private horariosRequestId = 0;

  constructor(
    public bookingStorage: BookingStorageService,
    public barberData: BarberDataService,
    private api: ApiService,
    private audioService: AudioService
  ) {
    // Ao abrir o modal (ou quando serviços/barbeiros chegam da API), sincroniza a seleção e consulta os horários.
    effect(() => {
      const aberto = this.bookingStorage.isBookingModalOpen();
      const servico = this.bookingStorage.selectedService();
      const barbeiro = this.bookingStorage.selectedBarber();
      const services = this.barberData.services();
      const barbers = this.barberData.barbers();
      if (!aberto) return;

      untracked(() => {
        this.selectedServiceId = servico?.id ?? this.selectedServiceId ?? services[0]?.id ?? null;
        this.selectedBarberId = barbeiro?.id ?? this.selectedBarberId ?? barbers[0]?.id ?? null;
        this.carregarHorarios();
      });
    });
  }

  get activeService(): ServiceItem | undefined {
    return this.barberData.services().find(s => s.id === this.selectedServiceId);
  }

  get activeBarber(): BarberStaff | undefined {
    return this.barberData.barbers().find(b => b.id === this.selectedBarberId);
  }

  close(): void {
    this.isCompleted = false;
    this.bookingStorage.closeBookingModal();
  }

  selectTime(t: string): void {
    this.audioService.playClickSound();
    this.selectedTime = t;
  }

  onServiceChange(id: number): void {
    this.selectedServiceId = id;
    this.carregarHorarios();
  }

  onBarberChange(id: number): void {
    this.selectedBarberId = id;
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
      next: (lista) => {
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

  confirmBooking(): void {
    if (!this.bookingStorage.currentUser()) {
      this.bookingStorage.closeBookingModal();
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
        this.confirmedCode = agendamento.code;
        this.isCompleted = true;
      },
      error: () => {
        this.enviando = false;
        this.carregarHorarios();
      }
    });
  }
}
