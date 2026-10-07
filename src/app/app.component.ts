import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { ServicesSectionComponent } from './components/services-section/services-section.component';
import { BarbersSectionComponent } from './components/barbers-section/barbers-section.component';
import { BookingWidgetComponent } from './components/booking-widget/booking-widget.component';
import { MyAppointmentsComponent } from './components/my-appointments/my-appointments.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { LocationFaqComponent } from './components/location-faq/location-faq.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { ToastComponent } from './components/toast/toast.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FeaturesComponent,
    ServicesSectionComponent,
    BarbersSectionComponent,
    BookingWidgetComponent,
    MyAppointmentsComponent,
    TestimonialsSectionComponent,
    LocationFaqComponent,
    BookingModalComponent,
    AuthModalComponent,
    ToastComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Barbearia Navalha & Ouro';
}
