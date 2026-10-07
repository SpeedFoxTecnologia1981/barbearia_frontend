import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberDataService } from '../../services/barber-data.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(
    public barberData: BarberDataService,
    private audioService: AudioService
  ) {}

  scrollToTop(): void {
    this.audioService.playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollTo(id: string): void {
    this.audioService.playClickSound();
    const elem = document.getElementById(id);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  }
}
