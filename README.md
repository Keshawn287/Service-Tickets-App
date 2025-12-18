# 🎫 Service Ticket App (Angular + ASP.NET Core)

- A simple full-stack application demonstrating:
- Angular (MVVM-style, two-way binding)
- ASP.NET Core Web API (async/await)
- RESTful API integration
- Clean frontend/backend separation
- Local development with a single command

## ⚙️ Prerequisites

Node.js (LTS recommended)
Angular CLI

# 🎫 Service Ticket App (Angular + ASP.NET Core)

- A simple full-stack application demonstrating:
  - Angular (MVVM-style, two-way binding)
  - ASP.NET Core Web API (async/await)
  - RESTful API integration
  - Clean frontend/backend separation
  - Local development with a single command

## ⚙️ Prerequisites

- Node.js (LTS recommended)
- Angular CLI
- .NET SDK 7+

Installable commands:

```bash
npm install -g @angular/cli
dotnet --version
```

## 📁 Project Structure

### 🗂️ Repository Structure:

The project is organized as a single repository with separate frontend and backend applications:

```
service-ticket-app/
├─ backend/
│ └─ SeviceTicketApi/ # ASP.NET Core Web API
│
├─ frontend/
│ └─ service-ticket-ui/ # Angular application
│
└─ package.json # Root scripts for local development
```

The frontend (Angular) and backend (ASP.NET Core) are intentionally separated to follow modern enterprise application architecture and separation of concerns principles.

1. Clear responsibility boundaries
2. Independent development and deployment
3. Technology independence
4. Easier testing and CI/CD

## 🏗️ Project Set Up

**Ensure the following tools are installed on your machine:**

### .NET SDK (7 or later)

Used to build and run the ASP.NET Core Web API.

```bash
dotnet --version
```

### Node.js (LTS)

Required for Angular and npm.

```bash
node -v
npm -v
```

### Angular CLI

Used to scaffold and run the Angular application.

```bash
npm install -g @angular/cli
ng version
```

Step 1: Create the Repository Structure

Create a root project folder and separate frontend and backend directories.

```bash
mkdir service-ticket-app
cd service-ticket-app
mkdir backend frontend
```

Resulting structure:

```
service-ticket-app/
├─ backend/
├─ frontend/
```

Step 2: Create the ASP.NET Core Web API (Backend)

Navigate to the backend folder and create a Web API project.

```bash
cd backend
dotnet new webapi -n ServiceTicketApi
cd TicketApi
```

Run the API to verify it starts successfully:

```bash
dotnet run
```

The API will be available at:

- https://localhost:5001 (HTTPS)
- http://localhost:5000 (HTTP)

Stop the application with Ctrl + C.

Step 3: Create the Angular Application (Frontend)

Navigate to the frontend folder and create the Angular application.

```bash
cd ../../frontend
ng new ticket-ui
cd ticket-ui
```

Recommended CLI selections:

- Stylesheet format: CSS
- Server-Side Rendering (SSR/SSG): No

Run the Angular application:

```bash
ng serve
```

The UI will be available at:

- http://localhost:4200

Stop the application with Ctrl + C.

Step 4: Configure Angular Proxy for API Calls

To allow the Angular app to call the ASP.NET Core API without CORS issues, configure a development proxy.

Create frontend/ticket-ui/proxy.conf.json:

```json
{
  "/api": {
    "target": "https://localhost:5001",
    "secure": false,
    "changeOrigin": true
  }
}
```

Update the Angular package.json script:

```json
"start": "ng serve --proxy-config proxy.conf.json"
```

With this configuration, Angular can call:

- /api/tickets

and the request will be forwarded to:

- https://localhost:5001/api/tickets

Step 5: Enable CORS in ASP.NET Core (Recommended)

In Program.cs, enable CORS for local development:

```c#
builder.Services.AddCors(options =>
{
	options.AddPolicy("dev", policy =>
		policy.WithOrigins("http://localhost:4200")
			.AllowAnyHeader()
			.AllowAnyMethod());
});

app.UseCors("dev");
```

This ensures proper cross-origin support when the frontend and backend run on different ports.

Step 6: Add Root Scripts to Run Both Applications Together

At the repository root (ticket-app/), create a package.json file:

```json
{
  "name": "ticket-app",
  "private": true,
  "scripts": {
    "install:ui": "npm install --prefix frontend/ticket-ui",
    "start:api": "dotnet run --project backend/TicketApi",
    "start:ui": "npm start --prefix frontend/ticket-ui",
    "start": "concurrently \"npm run start:api\" \"npm run start:ui\""
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

Install root dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
npm run install:ui
```

Step 7: Run the Full Application

From the repository root:

```bash
npm start
```

This will start:

- ASP.NET Core API on https://localhost:5001
- Angular UI on http://localhost:4200

The Angular application communicates with the backend via /api endpoints.
