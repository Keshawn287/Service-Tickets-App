var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("dev", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("dev");

// In-memory ticket store (replace with DB later)
var tickets = new List<ServiceTicket>
{
    new(1, "Printer not working", "Open", "Medium")
};

// Ticket endpoints
app.MapGet("/api/tickets", () => tickets);

app.MapPost("/api/tickets", (ServiceTicket ticket) =>
{
    var nextId = tickets.Count == 0 ? 1 : tickets.Max(t => t.Id) + 1;
    var created = ticket with { Id = nextId };
    tickets.Add(created);
    return Results.Created($"/api/tickets/{created.Id}", created);
});

app.MapDelete("/api/tickets/{id:int}", (int id) =>
{
    var removed = tickets.RemoveAll(t => t.Id == id);
    return removed == 0 ? Results.NotFound() : Results.NoContent();
});

app.Run();

// Domain model
record ServiceTicket(int Id, string Title, string Status, string Priority);
