import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStorageService } from '../../services/booking-storage.service';
import { AudioService } from '../../services/audio.service';
import { BarberDataService } from '../../services/barber-data.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  constructor(
    public bookingStorage: BookingStorageService,
    public barberData: BarberDataService,
    private audioService: AudioService
  ) {}

  openBooking(): void {
    this.audioService.playClickSound();
    this.bookingStorage.openBookingModal();
  }

  scrollToServices(): void {
    this.audioService.playClickSound();
    const elem = document.getElementById('servicos');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
