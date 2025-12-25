import { Component } from '@angular/core';
import { TicketsComponent } from './tickets/tickets.component'; // adjust path if needed

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TicketsComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
