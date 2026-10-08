import { Injectable } from '@angular/core';
import { BarberStaff, ClientTestimonial, FaqItem, ServiceItem } from '../models/barber.models';

@Injectable({
  providedIn: 'root'
})
export class BarberDataService {
  readonly services: ServiceItem[] = [
    {
      id: 'corte-degrade',
      name: 'Corte Fade & Degradê Cirúrgico',
      category: 'cabelo',
      durationMinutes: 45,
      price: 55,
      description: 'Acabamento minucioso com tesoura e máquina, finalização com pomada matte premium e alinhamento do pezinho.',
      popular: true,
      image: '/images/corte.jpg'
    },
    {
      id: 'combo-imperial',
      name: 'Combo Imperial (Cabelo + Barba Completa)',
      category: 'combos',
      durationMinutes: 75,
      price: 90,
      description: 'O combo mais desejado: Corte estilizado completo com alinhamento minucioso e acabamento impecável da barba.',
      popular: true,
      image: '/images/hero.jpg'
    },
    {
      id: 'corte-tesoura-classico',
      name: 'Corte Clássico na Tesoura',
      category: 'cabelo',
      durationMinutes: 45,
      price: 50,
      description: 'Técnica tradicional executada 100% na tesoura, respeitando o caimento e alinhamento natural dos fios.',
      popular: false,
      image: '/images/corte.jpg'
    }
  ];

  readonly barbers: BarberStaff[] = [
    {
      id: 'julius',
      name: 'Julius',
      role: 'Master Barber & Fundador',
      experienceYears: 12,
      rating: 4.98,
      totalReviews: 840,
      photo: '/images/barbeiro1.jpg',
      bio: 'Especialista em cortes clássicos executivos e barba rústica italiana na navalha afiada.',
      specialties: ['Navalha Clássica', 'Corte Tradicional']
    }
  ];

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
