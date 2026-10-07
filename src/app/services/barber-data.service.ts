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
      id: 'barba-terapia',
      name: 'Barboterapia & Toalha Quente',
      category: 'barba',
      durationMinutes: 40,
      price: 45,
      description: 'Aquece a pele com vaporizador e toalha quente aromática, desenho na navalha tradicional, óleo hidratante e massagem facial.',
      popular: true,
      image: '/images/barba.jpg'
    },
    {
      id: 'combo-imperial',
      name: 'Combo Imperial (Cabelo + Barba + Bebida)',
      category: 'combos',
      durationMinutes: 75,
      price: 90,
      description: 'O combo mais desejado: Corte estilizado completo + Barboterapia relaxante + Cerveja artesanal ou café expresso cortesia.',
      popular: true,
      image: '/images/hero.jpg'
    },
    {
      id: 'corte-tesoura-classico',
      name: 'Corte Clássico na Tesoura',
      category: 'cabelo',
      durationMinutes: 45,
      price: 50,
      description: 'Técnica tradicional executada 100% na tesoura, respeitando o caimento natural dos fios e visagismo do rosto.',
      popular: false,
      image: '/images/corte.jpg'
    },
    {
      id: 'platinado-nevou',
      name: 'Platinado / Nevou Master',
      category: 'tratamento',
      durationMinutes: 120,
      price: 160,
      description: 'Descoloração global segura com proteção capilar de alta performance, matização acinzentada e hidratação profunda.',
      popular: false,
      image: '/images/corte.jpg'
    },
    {
      id: 'spa-facial-sobrancelha',
      name: 'Spa Facial com Ozônio & Sobrancelha',
      category: 'tratamento',
      durationMinutes: 30,
      price: 35,
      description: 'Esfoliação com vapor de ozônio, máscara de carvão ativado para remoção de cravos e alinhamento simétrico da sobrancelha.',
      popular: false,
      image: '/images/barba.jpg'
    }
  ];

  readonly barbers: BarberStaff[] = [
    {
      id: 'marcos-silva',
      name: 'Marcos "Navalha" Silva',
      role: 'Master Barber & Fundador',
      experienceYears: 12,
      rating: 4.98,
      totalReviews: 840,
      photo: '/images/barbeiro1.jpg',
      bio: 'Especialista em cortes clássicos executivos e barba rústica italiana na navalha afiada.',
      specialties: ['Navalha Clássica', 'Barboterapia', 'Visagismo']
    },
    {
      id: 'gabriel-santos',
      name: 'Gabriel Santos',
      role: 'Especialista em Fade & FreeStyle',
      experienceYears: 7,
      rating: 4.95,
      totalReviews: 615,
      photo: '/images/barbeiro2.jpg',
      bio: 'Referência em degradês perfeitos (Skin Fade, Taper Fade), texturização e tendências urbanas.',
      specialties: ['Skin Fade', 'Colorimetria', 'Platinado']
    },
    {
      id: 'lucas-alencar',
      name: 'Lucas Alencar',
      role: 'Hair Stylist & Barbeiro VIP',
      experienceYears: 5,
      rating: 4.91,
      totalReviews: 430,
      photo: '/images/barbeiro1.jpg',
      bio: 'Focado em técnicas modernas de tesoura, tratamento capilar com ozônio e design de barbas.',
      specialties: ['Corte na Tesoura', 'Tratamentos', 'Design de Barba']
    }
  ];

  readonly testimonials: ClientTestimonial[] = [
    {
      id: '1',
      name: 'Rodrigo Medeiros',
      clientRole: 'Cliente há 2 anos',
      rating: 5,
      comment: 'Ambiente sensacional! A toalha quente na barba é um espetáculo à parte, e o corte do Marcos é sempre cirúrgico. Não troco por nenhuma outra.',
      date: 'Há 3 dias',
      avatarInitial: 'RM'
    },
    {
      id: '2',
      name: 'Felipe Albuquerque',
      clientRole: 'Empresário',
      rating: 5,
      comment: 'O agendamento pelo app é rápido demais e o atendimento é pontual sem atraso. Tomar um café expresso enquanto corto o cabelo não tem preço.',
      date: 'Há 1 semana',
      avatarInitial: 'FA'
    },
    {
      id: '3',
      name: 'Bruno Cavalcanti',
      clientRole: 'Designer',
      rating: 5,
      comment: 'O fade do Gabriel é perfeito! Ele tem uma atenção aos detalhes que poucos profissionais têm. Super recomendo a Barbearia Julius!',
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
      question: 'Vocês oferecem bebidas de cortesia?',
      answer: 'Sim! Todos os nossos clientes têm direito a café especial moído na hora, água mineral gelada ou uma cerveja artesanal long neck como cortesia em nossos atendimentos.'
    }
  ];

  readonly info = {
    name: 'Barbearia Julius',
    phone: '(11) 98765-4321',
    whatsappUrl: 'https://wa.me/5511987654321?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%20Barbearia',
    address: 'Av. Paulista, 1842 - Bela Vista, São Paulo - SP',
    schedule: 'Segunda a Sábado: 09:00 às 20:00 | Domingo: 10:00 às 15:00',
    instagram: '@barbeariajulius'
  };
}
