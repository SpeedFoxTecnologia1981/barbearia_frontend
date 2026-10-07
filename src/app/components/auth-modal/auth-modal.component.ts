import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingStorageService } from '../../services/booking-storage.service';
import { AudioService } from '../../services/audio.service';

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
  email: string = '';
  phone: string = '';
  password: string = '';

  constructor(
    public bookingStorage: BookingStorageService,
    private audioService: AudioService
  ) {}

  switchTab(register: boolean): void {
    this.audioService.playClickSound();
    this.isRegisterTab = register;
  }

  close(): void {
    this.bookingStorage.closeAuthModal();
  }

  submitAuth(): void {
    if (this.isRegisterTab) {
      if (!this.name.trim() || !this.email.trim() || !this.phone.trim()) {
        alert('Preencha os campos obrigatórios para criar sua conta.');
        return;
      }
      this.bookingStorage.saveUser({
        name: this.name,
        email: this.email,
        phone: this.phone
      });
    } else {
      if (!this.email.trim()) {
        alert('Informe seu e-mail para entrar.');
        return;
      }
      // Login simulado com o nome derivado do e-mail ou padrão
      const userName = this.name.trim() || this.email.split('@')[0];
      this.bookingStorage.saveUser({
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email: this.email,
        phone: this.phone || '(11) 99876-5432'
      });
    }

    this.audioService.playSuccessSound();
    this.close();
  }
}
