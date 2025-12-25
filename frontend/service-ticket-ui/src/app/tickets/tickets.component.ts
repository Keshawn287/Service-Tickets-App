import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketsApi } from './tickets.api';
import { Ticket } from './ticket.model';

type TicketViewModel = {
  title: string;
  status: Ticket['status'];
  priority: Ticket['priority'];
  notes: string;
};

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  loading = false;
  error = '';

  vm: TicketViewModel = { title: '', status: 'open', priority: 'medium', notes: '' };
  editingId: number | null = null;

  constructor(
    private ticketsApi: TicketsApi,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    await this.refresh();
  }

  /** Runs an async action and ensures UI updates in zoneless mode */
  private async runUi<T>(action: () => Promise<T>): Promise<T | undefined> {
    this.loading = true;
    this.error = '';

    // Update UI immediately (show spinner/disable buttons)
    this.cdr.detectChanges();

    try {
      const result = await action();

      // Ensure state changes after await get rendered
      this.cdr.detectChanges();
      return result;
    } catch (err) {
      console.error(err);
      this.error = 'Operation failed. Check DevTools → Network/Console.';
      this.cdr.detectChanges();
      return undefined;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  refresh() {
    return this.runUi(async () => {
      this.tickets = await this.ticketsApi.getAll();
    });
  }

  startEdit(ticket: Ticket) {
    this.editingId = ticket.id;
    this.vm = {
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
      notes: ticket.notes ?? '',
    };
    this.cdr.detectChanges(); // sync update
  }

  cancelEdit() {
    this.editingId = null;
    this.vm = { title: '', status: 'open', priority: 'medium', notes: '' };
    this.cdr.detectChanges(); // sync update
  }

  save() {
    return this.runUi(async () => {
      const payload: Omit<Ticket, 'id'> = {
        title: this.vm.title.trim(),
        status: this.vm.status,
        priority: this.vm.priority,
        notes: this.vm.notes.trim() || null,
      };

      if (!payload.title) {
        this.error = 'Title is required.';
        return;
      }

      if (this.editingId === null) {
        await this.ticketsApi.create(payload);
      } else {
        await this.ticketsApi.update(this.editingId, payload);
      }

      this.editingId = null;
      this.vm = { title: '', status: 'open', priority: 'medium', notes: '' };

      this.tickets = await this.ticketsApi.getAll();
    });
  }

  remove(id: number) {
    return this.runUi(async () => {
      await this.ticketsApi.delete(id);
      this.tickets = this.tickets.filter((t) => t.id !== id);
    });
  }
}
