var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// CORS policy
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("dev", policy =>
//         policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
//               .AllowAnyHeader()
//               .AllowAnyMethod());
// });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger UI (development only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS must be before MapControllers
// app.UseCors("dev");

app.MapControllers();

app.Run();


