import { Injectable, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, switchMap, tap } from 'rxjs';
import { BookingAppointment, ServiceItem, BarberStaff } from '../models/barber.models';
import { AgendamentoApi, AgendamentoRequestApi } from '../models/api.models';
import { TOKEN_KEY, USER_KEY } from '../core/api.config';
import { ApiService, apiErrorMessage } from './api.service';
import { AudioService } from './audio.service';

export interface SessionUser {
  id: number;
  name: string;
  phone: string;
}

/**
 * Estado global da aplicação: sessão do usuário (JWT), agendamentos, modais e toasts.
 * Os dados persistem no backend; só o token e o usuário ficam no navegador.
 */
@Injectable({
  providedIn: 'root'
})
export class BookingStorageService {
  readonly appointments = signal<BookingAppointment[]>([]);
  readonly isBookingModalOpen = signal<boolean>(false);
  readonly isAuthModalOpen = signal<boolean>(false);
  readonly selectedService = signal<ServiceItem | null>(null);
  readonly selectedBarber = signal<BarberStaff | null>(null);
  readonly currentUser = signal<SessionUser | null>(null);
  readonly toastMessage = signal<{ title: string; text: string; type: 'success' | 'info' | 'error' } | null>(null);

  readonly confirmedCount = computed(() =>
    this.appointments().filter(a => a.status === 'confirmado').length
  );

  constructor(
    private readonly api: ApiService,
    private readonly audioService: AudioService
  ) {
    this.restoreSession();
  }

  // ---------------------------------------------------------------- sessão

  private restoreSession(): void {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const user = localStorage.getItem(USER_KEY);
      if (token && user) {
        this.currentUser.set(JSON.parse(user));
        this.loadAppointments();
      }
    } catch {
      this.clearSession();
    }
  }

  private saveSession(token: string, user: SessionUser): void {
    this.currentUser.set(user);
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // sem persistência: a sessão vale só até recarregar a página
    }
  }

  private clearSession(): void {
    this.currentUser.set(null);
    this.appointments.set([]);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignora
    }
  }

  login(nome: string, telefone: string): Observable<void> {
    return this.api.login({ nome, telefone }).pipe(
      tap(res => {
        this.saveSession(res.token, { id: res.usuarioId, name: res.nome, phone: telefone });
        this.loadAppointments();
        this.showToast('Bem-vindo!', `Olá, ${res.nome}! Conta conectada com sucesso.`, 'success');
      }),
      map(() => undefined)
    );
  }

  /** Cria a conta e já entra com ela. */
  register(nome: string, apelido: string, telefone: string): Observable<void> {
    return this.api.cadastrar({ nome, apelido: apelido || undefined, telefone }).pipe(
      switchMap(() => this.login(nome, telefone))
    );
  }

  logout(): void {
    this.clearSession();
    this.showToast('Até logo', 'Você saiu da sua conta.', 'info');
  }

  /** Pede login antes de uma ação que precisa de conta (ex.: agendar). */
  requireLogin(): void {
    this.showToast('Entre na sua conta', 'Entre ou crie sua conta para confirmar o agendamento.', 'info');
    this.isAuthModalOpen.set(true);
  }

  // ------------------------------------------------------------- agendamentos

  loadAppointments(): void {
    this.api.meusAgendamentos().subscribe({
      next: lista => this.appointments.set(lista.map(a => this.mapAgendamento(a))),
      error: (err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403) {
          this.expireSession();
        } else {
          this.showToast('Erro', apiErrorMessage(err, 'Não foi possível carregar seus agendamentos.'), 'error');
        }
      }
    });
  }

  createAppointment(req: AgendamentoRequestApi): Observable<BookingAppointment> {
    return this.api.criarAgendamento(req).pipe(
      map(a => this.mapAgendamento(a)),
      tap({
        next: novo => {
          this.appointments.set([novo, ...this.appointments()]);
          this.audioService.playSuccessSound();
          this.triggerBrowserNotification(novo);
          this.showToast(
            'Agendamento Confirmado! ✂️',
            `${novo.serviceName} com ${novo.barberName} para o dia ${this.formatDate(novo.date)} às ${novo.time}.`,
            'success'
          );
        },
        error: (err: HttpErrorResponse) => this.handleActionError(err, 'Não foi possível concluir o agendamento.')
      })
    );
  }

  cancelAppointment(id: number): void {
    this.api.cancelarAgendamento(id).subscribe({
      next: atualizado => {
        const novo = this.mapAgendamento(atualizado);
        this.appointments.set(this.appointments().map(a => (a.id === id ? novo : a)));
        this.audioService.playClickSound();
        this.showToast('Agendamento Cancelado', 'Seu agendamento foi cancelado com sucesso.', 'info');
      },
      error: (err: HttpErrorResponse) => this.handleActionError(err, 'Não foi possível cancelar o agendamento.')
    });
  }

  private handleActionError(err: HttpErrorResponse, fallback: string): void {
    if (err.status === 401 || err.status === 403) {
      this.expireSession();
      return;
    }
    this.showToast('Ops!', apiErrorMessage(err, fallback), 'error');
  }

  private expireSession(): void {
    this.clearSession();
    this.showToast('Sessão expirada', 'Entre novamente para continuar.', 'info');
    this.isAuthModalOpen.set(true);
  }

  private mapAgendamento(a: AgendamentoApi): BookingAppointment {
    const status: BookingAppointment['status'] =
      a.status === 'CANCELADO' || a.status === 'NAO_COMPARECEU' ? 'cancelado'
      : a.status === 'FINALIZADO' ? 'concluido'
      : 'confirmado';
    return {
      id: a.id,
      code: 'AG-' + String(a.id).padStart(4, '0'),
      serviceName: a.servico,
      barberName: a.barbeiro,
      date: a.data,
      time: a.horaInicio.slice(0, 5),
      clientName: a.usuario,
      price: Number(a.valor),
      status
    };
  }

  private formatDate(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  // ------------------------------------------------------------------ UI

  openBookingModal(service?: ServiceItem, barber?: BarberStaff): void {
    this.audioService.playClickSound();
    if (service) this.selectedService.set(service);
    if (barber) this.selectedBarber.set(barber);
    this.isBookingModalOpen.set(true);
  }

  closeBookingModal(): void {
    this.audioService.playClickSound();
    this.isBookingModalOpen.set(false);
  }

  openAuthModal(): void {
    this.audioService.playClickSound();
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal(): void {
    this.audioService.playClickSound();
    this.isAuthModalOpen.set(false);
  }

  showToast(title: string, text: string, type: 'success' | 'info' | 'error' = 'info'): void {
    this.toastMessage.set({ title, text, type });
    setTimeout(() => {
      if (this.toastMessage()?.title === title) {
        this.toastMessage.set(null);
      }
    }, 5000);
  }

  clearToast(): void {
    this.toastMessage.set(null);
  }

  private triggerBrowserNotification(booking: BookingAppointment): void {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const body = `Agendamento confirmado para ${this.formatDate(booking.date)} às ${booking.time}! Esperamos por você.`;
      if (Notification.permission === 'granted') {
        new Notification('Barbearia Julius', { body, icon: '/favicon.ico' });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Barbearia Julius', { body, icon: '/favicon.ico' });
          }
        });
      }
    }
  }
}
