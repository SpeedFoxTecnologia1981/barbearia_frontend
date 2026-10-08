import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberDataService } from '../../services/barber-data.service';
import { BookingStorageService } from '../../services/booking-storage.service';
import { AudioService } from '../../services/audio.service';
import { ServiceItem, BarberStaff } from '../../models/barber.models';

@Component({
  selector: 'app-booking-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-widget.component.html',
  styleUrl: './booking-widget.component.css'
})
export class BookingWidgetComponent implements OnInit {
  selectedServiceId: string = 'combo-imperial';
  selectedBarberId: string = 'julius';
  selectedDate: string = '';
  selectedTime: string = '15:00';
  
  clientName: string = '';
  clientPhone: string = '';
  clientEmail: string = '';
  notes: string = '';

  isSubmitted: boolean = false;
  confirmationData: any = null;

  readonly availableTimes = [
    '09:00', '09:45', '10:30', '11:15',
    '13:30', '14:15', '15:00', '15:45',
    '16:30', '17:15', '18:00', '19:00'
  ];

  constructor(
    public barberData: BarberDataService,
    public bookingStorage: BookingStorageService,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    // Definir data padrão para hoje
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];

    // Se houver usuário logado, preencher campos automaticamente
    const user = this.bookingStorage.currentUser();
    if (user) {
      this.clientName = user.name;
      this.clientPhone = user.phone;
      this.clientEmail = user.email;
    }
  }

  get currentSelectedService(): ServiceItem | undefined {
    return this.barberData.services.find(s => s.id === this.selectedServiceId);
  }

  get currentSelectedBarber(): BarberStaff | undefined {
    return this.barberData.barbers.find(b => b.id === this.selectedBarberId);
  }

  selectTime(time: string): void {
    this.audioService.playClickSound();
    this.selectedTime = time;
  }

  selectService(serviceId: string): void {
    this.audioService.playClickSound();
    this.selectedServiceId = serviceId;
  }

  selectBarber(barberId: string): void {
    this.audioService.playClickSound();
    this.selectedBarberId = barberId;
  }

  submitBooking(): void {
    if (!this.clientName.trim() || !this.clientPhone.trim()) {
      alert('Por favor, informe seu nome e telefone para o agendamento.');
      return;
    }

    const service = this.currentSelectedService;
    const barber = this.currentSelectedBarber;

    if (!service || !barber) return;

    const newBooking = this.bookingStorage.createAppointment({
      serviceId: service.id,
      serviceName: service.name,
      barberId: barber.id,
      barberName: barber.name,
      date: this.selectedDate,
      time: this.selectedTime,
      clientName: this.clientName,
      clientPhone: this.clientPhone,
      clientEmail: this.clientEmail,
      notes: this.notes,
      price: service.price
    });

    this.confirmationData = newBooking;
    this.isSubmitted = true;
  }

  resetBookingForm(): void {
    this.audioService.playClickSound();
    this.isSubmitted = false;
    this.confirmationData = null;
  }
}
