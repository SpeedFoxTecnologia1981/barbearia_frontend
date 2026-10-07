import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStorageService } from '../../services/booking-storage.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-appointments.component.html',
  styleUrl: './my-appointments.component.css'
})
export class MyAppointmentsComponent {
  constructor(
    public bookingStorage: BookingStorageService,
    private audioService: AudioService
  ) {}

  cancelAppointment(id: string): void {
    if (confirm('Deseja realmente cancelar este agendamento?')) {
      this.bookingStorage.cancelAppointment(id);
    }
  }

  openNewBooking(): void {
    this.audioService.playClickSound();
    this.bookingStorage.openBookingModal();
  }
}
