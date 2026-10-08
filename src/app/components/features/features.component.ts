import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent {
  readonly features = [
    {
      icon: '⏱️',
      title: 'Sem Espera & 100% Pontual',
      description: 'Agende em poucos cliques pelo aplicativo e receba lembretes automáticos. Respeito total ao seu tempo.',
      highlight: 'Pontualidade Garantida'
    }
  ];
}
