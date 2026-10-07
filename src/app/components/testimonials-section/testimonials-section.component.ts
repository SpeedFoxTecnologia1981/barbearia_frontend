import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberDataService } from '../../services/barber-data.service';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.css'
})
export class TestimonialsSectionComponent {
  constructor(public barberData: BarberDataService) {}
}
