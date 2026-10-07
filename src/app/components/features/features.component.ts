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
      icon: '✂️',
      title: 'Mestres do Visagismo',
      description: 'Análise detalhada do formato do rosto e textura do fio para o corte e barba ideais para o seu perfil.',
      highlight: 'Consultoria Personalizada'
    },
    {
      icon: '♨️',
      title: 'Barboterapia com Toalha Quente',
      description: 'Ritual clássico italiano com vaporizador de ozônio, óleos essenciais e toalha quente relaxante.',
      highlight: 'Zero Irritação na Pele'
    },
    {
      icon: '🍺',
      title: 'Cerveja Artesanal & Café Cortesia',
      description: 'Desfrute do nosso lounge com música ambiente de bom gosto, chopp gelado ou espresso moído na hora.',
      highlight: 'Incluso no Atendimento'
    },
    {
      icon: '⏱️',
      title: 'Sem Espera & 100% Pontual',
      description: 'Agende em poucos cliques pelo aplicativo e receba lembretes automáticos. Respeito total ao seu tempo.',
      highlight: 'Pontualidade Garantida'
    }
  ];
}
