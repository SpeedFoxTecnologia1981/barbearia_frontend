import { Injectable, signal } from '@angular/core';
import { BarberStaff, ClientTestimonial, FaqItem, ServiceItem } from '../models/barber.models';
import { BarbeiroApi, ServicoApi } from '../models/api.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BarberDataService {
  /** Serviços e barbeiros vêm da API; o restante (fotos, bio, categoria) é apresentação do frontend. */
  readonly services = signal<ServiceItem[]>([]);
  readonly barbers = signal<BarberStaff[]>([]);
  readonly loading = signal<boolean>(true);
  readonly loadError = signal<boolean>(false);

  constructor(private readonly api: ApiService) {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.loadError.set(false);
    let pending = 2;
    const done = () => { if (--pending === 0) this.loading.set(false); };
    const fail = () => { this.loadError.set(true); done(); };

    this.api.listarServicos().subscribe({
      next: (lista) => { this.services.set(lista.map(s => this.mapServico(s))); done(); },
      error: fail
    });
    this.api.listarBarbeiros().subscribe({
      next: (lista) => { this.barbers.set(lista.map((b, i) => this.mapBarbeiro(b, i))); done(); },
      error: fail
    });
  }

  private mapServico(s: ServicoApi): ServiceItem {
    const nome = s.nome.toLowerCase();
    // Categoria, imagem e destaque ainda não existem no backend: inferidos pelo nome.
    const category: ServiceItem['category'] =
      nome.includes('combo') ? 'combos' : nome.includes('barba') ? 'barba' : 'cabelo';
    const image = category === 'combos' ? '/images/hero.jpg' : category === 'barba' ? '/images/barba.jpg' : '/images/corte.jpg';
    return {
      id: s.id,
      name: s.nome,
      category,
      durationMinutes: s.duracaoMinutos,
      price: Number(s.valor),
      description: s.descricao ?? '',
      popular: nome.includes('fade') || nome.includes('combo'),
      image
    };
  }

  private mapBarbeiro(b: BarbeiroApi, index: number): BarberStaff {
    const isJulius = b.nome.trim().toLowerCase() === 'julius';
    if (isJulius) {
      return {
        id: b.id,
        name: b.nome,
        role: 'Master Barber & Fundador',
        experienceYears: 12,
        rating: 4.98,
        totalReviews: 840,
        photo: '/images/barbeiro1.jpg',
        bio: 'Especialista em cortes clássicos executivos e barba rústica italiana na navalha afiada.',
        specialties: ['Navalha Clássica', 'Corte Tradicional']
      };
    }
    return {
      id: b.id,
      name: b.nome,
      role: 'Barbeiro Profissional',
      experienceYears: 0,
      rating: 5,
      totalReviews: 0,
      photo: index % 2 === 0 ? '/images/barbeiro1.jpg' : '/images/barbeiro2.jpg',
      bio: 'Profissional da Barbearia Julius.',
      specialties: []
    };
  }

  readonly testimonials: ClientTestimonial[] = [
    {
      id: '1',
      name: 'Rodrigo Medeiros',
      clientRole: 'Cliente há 2 anos',
      rating: 5,
      comment: 'Ambiente sensacional! O cuidado com a barba é um espetáculo à parte, e o corte do Julius é sempre cirúrgico. Não troco por nenhuma outra.',
      date: 'Há 3 dias',
      avatarInitial: 'RM'
    },
    {
      id: '2',
      name: 'Felipe Albuquerque',
      clientRole: 'Empresário',
      rating: 5,
      comment: 'O agendamento pelo app é rápido demais e o atendimento é pontual sem atraso. Cortar o cabelo com o Julius com essa qualidade não tem preço.',
      date: 'Há 1 semana',
      avatarInitial: 'FA'
    },
    {
      id: '3',
      name: 'Bruno Cavalcanti',
      clientRole: 'Designer',
      rating: 5,
      comment: 'O fade do Julius é perfeito! Ele tem uma atenção aos detalhes que poucos profissionais têm. Super recomendo a Barbearia Julius!',
      date: 'Há 2 semanas',
      avatarInitial: 'BC'
    }
  ];

  readonly faqs: FaqItem[] = [
    {
      question: 'Preciso agendar com antecedência?',
      answer: 'Recomendamos o agendamento prévio pelo nosso aplicativo para garantir o seu horário exclusivo sem tempo de espera. No entanto, também atendemos por ordem de chegada mediante disponibilidade.'
    },
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceitamos Pix (com confirmação instantânea), cartões de crédito e débito de todas as bandeiras, e dinheiro em espécie. O pagamento pode ser feito após o atendimento na barbearia.'
    },
    {
      question: 'Como funciona o cancelamento ou reagendamento?',
      answer: 'Você pode cancelar ou alterar seu horário facilmente através do aplicativo com até 1 hora de antecedência sem nenhuma taxa.'
    },
    {
      question: 'O agendamento garante meu horário exclusivo?',
      answer: 'Sim! Ao reservar o seu horário pelo aplicativo, você tem atendimento pontual e prioritário garantido com o Julius, sem tempo de espera.'
    }
  ];

  readonly info = {
    name: 'Barbearia Julius',
    phone: '(31) 98020-8758',
    whatsappUrl: 'https://wa.me/5531980208758?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%20Barbearia',
    address: 'Rua Dirceu Martins Figueiredo 72, Jequitibá/ MG',
    schedule: 'Segunda a Sábado: 07:30 às 20:30 | Aos Domingos estamos fechados',
    instagram: '@barbeariajulius'
  };
}
