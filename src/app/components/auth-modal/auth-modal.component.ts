import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingStorageService } from '../../services/booking-storage.service';
import { AudioService } from '../../services/audio.service';
import { apiErrorMessage } from '../../services/api.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  isRegisterTab: boolean = false;

  name: string = '';
  nickname: string = '';
  phone: string = '';

  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    public bookingStorage: BookingStorageService,
    private audioService: AudioService
  ) {}

  switchTab(register: boolean): void {
    this.audioService.playClickSound();
    this.isRegisterTab = register;
    this.errorMessage = '';
  }

  close(): void {
    this.errorMessage = '';
    this.bookingStorage.closeAuthModal();
  }

  submitAuth(): void {
    const name = this.name.trim();
    const phone = this.phone.trim();
    this.errorMessage = '';

    if (!name || !phone) {
      this.errorMessage = 'Informe seu nome e telefone.';
      return;
    }
    if (this.isRegisterTab && name.length < 3) {
      this.errorMessage = 'O nome deve ter pelo menos 3 caracteres.';
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      this.errorMessage = 'Informe o telefone com DDD.';
      return;
    }

    this.loading = true;
    const request$ = this.isRegisterTab
      ? this.bookingStorage.register(name, this.nickname.trim(), phone)
      : this.bookingStorage.login(name, phone);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.audioService.playSuccessSound();
        this.name = '';
        this.nickname = '';
        this.phone = '';
        this.close();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = apiErrorMessage(
          err,
          this.isRegisterTab ? 'Não foi possível criar a conta.' : 'Não foi possível entrar.'
        );
      }
    });
  }
}
