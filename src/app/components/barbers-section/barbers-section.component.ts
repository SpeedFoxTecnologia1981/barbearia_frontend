import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberDataService } from '../../services/barber-data.service';
import { BookingStorageService } from '../../services/booking-storage.service';
import { AudioService } from '../../services/audio.service';
import { BarberStaff } from '../../models/barber.models';

@Component({
  selector: 'app-barbers-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './barbers-section.component.html',
  styleUrl: './barbers-section.component.css'
})
export class BarbersSectionComponent {
  constructor(
    public barberData: BarberDataService,
    public bookingStorage: BookingStorageService,
    private audioService: AudioService
  ) {}

  selectBarber(barber: BarberStaff): void {
    this.audioService.playClickSound();
    this.bookingStorage.openBookingModal(undefined, barber);
  }
}
