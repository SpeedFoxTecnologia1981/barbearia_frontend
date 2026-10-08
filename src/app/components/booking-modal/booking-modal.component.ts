import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingStorageService } from '../../services/booking-storage.service';
import { BarberDataService } from '../../services/barber-data.service';
import { AudioService } from '../../services/audio.service';
import { ServiceItem, BarberStaff } from '../../models/barber.models';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.css'
})
export class BookingModalComponent {
  selectedServiceId: string = 'corte-degrade';
  selectedBarberId: string = 'julius';
  selectedDate: string = '';
  selectedTime: string = '14:15';
  
  clientName: string = '';
  clientPhone: string = '';
  clientEmail: string = '';
  
  isCompleted: boolean = false;
  confirmedCode: string = '';

  readonly availableTimes = [
    '07:30', '08:30', '09:30', '10:30', '11:30',
    '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:45'
  ];

  constructor(
    public bookingStorage: BookingStorageService,
    public barberData: BarberDataService,
    private audioService: AudioService
  ) {
    const initialDate = new Date();
    if (initialDate.getDay() === 0) {
      initialDate.setDate(initialDate.getDate() + 1);
    }
    this.selectedDate = initialDate.toISOString().split('T')[0];

    // Effect reativo para sincronizar seleção prévia ao abrir modal
    effect(() => {
      const s = this.bookingStorage.selectedService();
      if (s) {
        this.selectedServiceId = s.id;
      }
      const b = this.bookingStorage.selectedBarber();
      if (b) {
        this.selectedBarberId = b.id;
      }
      const u = this.bookingStorage.currentUser();
      if (u) {
        this.clientName = u.name;
        this.clientPhone = u.phone;
        this.clientEmail = u.email;
      }
    });
  }

  get activeService(): ServiceItem | undefined {
    return this.barberData.services.find(s => s.id === this.selectedServiceId);
  }

  get activeBarber(): BarberStaff | undefined {
    return this.barberData.barbers.find(b => b.id === this.selectedBarberId);
  }

  close(): void {
    this.isCompleted = false;
    this.bookingStorage.closeBookingModal();
  }

  selectTime(t: string): void {
    this.audioService.playClickSound();
    this.selectedTime = t;
  }

  confirmBooking(): void {
    if (!this.clientName.trim() || !this.clientPhone.trim()) {
      alert('Por favor informe seu nome e telefone.');
      return;
    }

    if (this.selectedDate) {
      const [year, month, day] = this.selectedDate.split('-').map(Number);
      const chosenDate = new Date(year, month - 1, day);
      if (chosenDate.getDay() === 0) {
        alert('Aos Domingos estamos fechados! Por favor, selecione uma data de Segunda a Sábado.');
        return;
      }
    }

    const s = this.activeService;
    const b = this.activeBarber;
    if (!s || !b) return;

    const res = this.bookingStorage.createAppointment({
      serviceId: s.id,
      serviceName: s.name,
      barberId: b.id,
      barberName: b.name,
      date: this.selectedDate,
      time: this.selectedTime,
      clientName: this.clientName,
      clientPhone: this.clientPhone,
      clientEmail: this.clientEmail,
      price: s.price
    });

    this.confirmedCode = res.id;
    this.isCompleted = true;
  }
}
