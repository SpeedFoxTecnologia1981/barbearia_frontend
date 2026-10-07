import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberDataService } from '../../services/barber-data.service';
import { BookingStorageService } from '../../services/booking-storage.service';
import { AudioService } from '../../services/audio.service';
import { ServiceItem } from '../../models/barber.models';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.css'
})
export class ServicesSectionComponent {
  readonly selectedCategory = signal<string>('todos');

  readonly categories = [
    { id: 'todos', label: 'Todos os Serviços' },
    { id: 'cabelo', label: 'Cortes & Cabelo' },
    { id: 'barba', label: 'Barba & Navalha' },
    { id: 'combos', label: 'Combos VIP' },
    { id: 'tratamento', label: 'Tratamentos & Spa' }
  ];

  readonly filteredServices = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'todos') {
      return this.barberData.services;
    }
    return this.barberData.services.filter(s => s.category === cat);
  });

  constructor(
    public barberData: BarberDataService,
    public bookingStorage: BookingStorageService,
    private audioService: AudioService
  ) {}

  selectCategory(categoryId: string): void {
    this.audioService.playClickSound();
    this.selectedCategory.set(categoryId);
  }

  bookService(service: ServiceItem): void {
    this.audioService.playClickSound();
    this.bookingStorage.openBookingModal(service);
  }
}
