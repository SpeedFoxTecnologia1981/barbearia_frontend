import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStorageService } from '../../services/booking-storage.service';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isScrolled = false;
  isMobileMenuOpen = false;

  constructor(
    public bookingStorage: BookingStorageService,
    private audioService: AudioService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 40;
  }

  toggleMobileMenu(): void {
    this.audioService.playClickSound();
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  openBooking(): void {
    this.closeMobileMenu();
    this.bookingStorage.openBookingModal();
  }

  openAuth(): void {
    this.closeMobileMenu();
    this.bookingStorage.openAuthModal();
  }

  logout(): void {
    this.bookingStorage.logout();
  }

  scrollToSection(sectionId: string): void {
    this.closeMobileMenu();
    this.audioService.playClickSound();
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
