import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberDataService } from '../../services/barber-data.service';
import { AudioService } from '../../services/audio.service';
import { BookingStorageService } from '../../services/booking-storage.service';

@Component({
  selector: 'app-location-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-faq.component.html',
  styleUrl: './location-faq.component.css'
})
export class LocationFaqComponent {
  readonly pixKey = 'contato@barbeariajulius.com.br';
  isPixCopied = false;

  constructor(
    public barberData: BarberDataService,
    private audioService: AudioService,
    private bookingStorage: BookingStorageService
  ) {}

  copyPixKey(): void {
    this.audioService.playClickSound();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.pixKey).catch(() => {});
    }
    this.isPixCopied = true;
    this.bookingStorage.showToast('Chave PIX Copiada!', 'A chave foi copiada com sucesso para a área de transferência.', 'success');
    setTimeout(() => {
      this.isPixCopied = false;
    }, 3000);
  }
}
