import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import {TicketTypesComponent} from './ticket-types/ticket-types.component';
import {AuthGuard} from './auth/auth.guard';
import {AuthAdminGuard} from './auth/auth-admin.guard';
import {ServicesComponent} from './services/services.component';
import {SelectTicketComponent} from './ticket-types/select-ticket/select-ticket.component';
import {TicketDetailsComponent} from './ticket-types/ticket-details/ticket-details.component';
import {EditTicketComponent} from './ticket-types/edit-ticket/edit-ticket.component';
import {SelectServiceComponent} from './services/select-service/select-service.component';
import {ServiceDetailsComponent} from './services/service-details/service-details.component';
import {EditServiceComponent} from './services/edit-service/edit-service.component';
import {HomeComponent} from './home/home.component';
import {AuthPassengerGuard} from './auth/auth-passenger.guard';
import {TicketsComponent} from './tickets/tickets.component';
import {SelectUserTicketComponent} from './tickets/select-user-ticket/select-user-ticket.component';
import {UserTicketsDetailsComponent} from './tickets/user-tickets-details/user-tickets-details.component';
import {AccountComponent} from './account/account.component';
import {NewTicketComponent} from './tickets/new-ticket/new-ticket.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'tickets', component: TicketTypesComponent, canActivate: [AuthAdminGuard], children: [
      { path: '', component: SelectTicketComponent },
      { path: 'new', component: EditTicketComponent },
      { path: ':id', component: TicketDetailsComponent },
      { path: ':id/edit', component: EditTicketComponent }
    ] },
  { path: 'services', component: ServicesComponent, canActivate: [AuthAdminGuard], children: [
      { path: '', component: SelectServiceComponent },
      { path: 'new', component: EditServiceComponent},
      { path: ':id', component: ServiceDetailsComponent },
      { path: ':id/edit', component: EditServiceComponent }
    ] },
  { path: 'user-tickets', component: TicketsComponent, canActivate: [AuthPassengerGuard], children: [
      { path: '', component: SelectUserTicketComponent },
      { path: 'new', component: NewTicketComponent },
      { path: ':id', component: UserTicketsDetailsComponent }
    ] },
  { path: 'account', component: AccountComponent, canActivate: [AuthPassengerGuard] },
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
