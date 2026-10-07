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
  selectedBarberId: string = 'marcos-silva';
  selectedDate: string = '';
  selectedTime: string = '14:15';
  
  clientName: string = '';
  clientPhone: string = '';
  clientEmail: string = '';
  
  isCompleted: boolean = false;
  confirmedCode: string = '';

  readonly availableTimes = [
    '09:00', '10:00', '11:00', '13:30', '14:15', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  constructor(
    public bookingStorage: BookingStorageService,
    public barberData: BarberDataService,
    private audioService: AudioService
  ) {
    this.selectedDate = new Date().toISOString().split('T')[0];

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
