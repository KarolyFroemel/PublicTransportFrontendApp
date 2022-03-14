import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { TicketTypesComponent } from './ticket-types/ticket-types.component';
import {AuthComponent} from './auth/auth.component';
import {AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth.guard';
import { ServicesComponent } from './services/services.component';
import { TicketItemComponent } from './ticket-types/ticket-type-list/ticket-item/ticket-item.component';
import {TicketService} from './shared/ticket.service';
import { TicketTypeListComponent } from './ticket-types/ticket-type-list/ticket-type-list.component';
import { SelectTicketComponent } from './ticket-types/select-ticket/select-ticket.component';
import { EditTicketComponent } from './ticket-types/edit-ticket/edit-ticket.component';
import { TicketDetailsComponent } from './ticket-types/ticket-details/ticket-details.component';
import {AuthInterceptorService} from './auth/auth-interceptor.service';
import {ServicesService} from './shared/services.service';
import { ServiceListComponent } from './services/service-list/service-list.component';
import { SelectServiceComponent } from './services/select-service/select-service.component';
import { ServiceItemComponent } from './services/service-list/service-item/service-item.component';
import { ServiceDetailsComponent } from './services/service-details/service-details.component';
import { EditServiceComponent } from './services/edit-service/edit-service.component';
import { HomeComponent } from './home/home.component';
import {AuthAdminGuard} from './auth/auth-admin.guard';
import { TicketsComponent } from './tickets/tickets.component';
import {AuthPassengerGuard} from './auth/auth-passenger.guard';
import {UserServiceService} from './shared/user-service.service';
import { UserTicketsListComponent } from './tickets/user-tickets-list/user-tickets-list.component';
import { SelectUserTicketComponent } from './tickets/select-user-ticket/select-user-ticket.component';
import { UserTicketItemComponent } from './tickets/user-tickets-list/user-ticket-item/user-ticket-item.component';
import { UserTicketsDetailsComponent } from './tickets/user-tickets-details/user-tickets-details.component';
import { AccountComponent } from './account/account.component';
import { NewTicketComponent } from './tickets/new-ticket/new-ticket.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    TicketTypesComponent,
    ServicesComponent,
    TicketItemComponent,
    TicketTypeListComponent,
    SelectTicketComponent,
    EditTicketComponent,
    TicketDetailsComponent,
    ServiceListComponent,
    SelectServiceComponent,
    ServiceItemComponent,
    ServiceDetailsComponent,
    EditServiceComponent,
    HomeComponent,
    TicketsComponent,
    UserTicketsListComponent,
    SelectUserTicketComponent,
    UserTicketItemComponent,
    UserTicketsDetailsComponent,
    AccountComponent,
    NewTicketComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    AuthAdminGuard,
    AuthPassengerGuard,
    ServicesService,
    TicketService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    UserServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
