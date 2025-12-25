import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { Ticket } from './ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketsApi {
  private readonly baseUrl = '/api/tickets';
  //private readonly baseUrl = 'http://localhost:5055/api/tickets';

  constructor(private http: HttpClient) {}

  async getAll(): Promise<Ticket[]> {
    return firstValueFrom(this.http.get<Ticket[]>(this.baseUrl).pipe(timeout(8000)));
  }

  async create(ticket: Omit<Ticket, 'id'>): Promise<Ticket> {
    return firstValueFrom(this.http.post<Ticket>(this.baseUrl, ticket));
  }

  async update(id: number, ticket: Omit<Ticket, 'id'>): Promise<Ticket> {
    return firstValueFrom(this.http.put<Ticket>(`${this.baseUrl}/${id}`, ticket));
  }

  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
  }
}
