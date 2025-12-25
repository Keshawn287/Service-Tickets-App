export interface Ticket {
  id: number;
  title: string;
  //description: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  //createdAt: Date;
  //updatedAt: Date;
  //assignedTo?: string;
  notes?: string | null;
}
