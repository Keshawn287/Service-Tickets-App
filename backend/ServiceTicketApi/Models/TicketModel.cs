namespace ServiceTicketApi.Models;

public record TicketModel(
  int Id,
  string Title,
  string Status,
  string Priority,
  string? Notes
);