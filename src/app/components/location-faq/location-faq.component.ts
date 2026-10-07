import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberDataService } from '../../services/barber-data.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-location-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-faq.component.html',
  styleUrl: './location-faq.component.css'
})
export class LocationFaqComponent {
  openFaqIndex: number | null = 0;

  constructor(
    public barberData: BarberDataService,
    private audioService: AudioService
  ) {}

  toggleFaq(index: number): void {
    this.audioService.playClickSound();
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}
