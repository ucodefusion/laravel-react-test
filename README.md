# Laravel Office Booking Platform

This repository implements a Laravel 11 + Inertia.js booking platform for managing office spaces, rooms, amenities, and reservations. The stack combines Laravel, MySQL, Sanctum, and React with Tailwind CSS to deliver a cohesive experience for members, staff, and administrators.

## Features

- Role-based access control powered by **spatie/laravel-permission**.
- Hierarchical management of offices, rooms, amenities, working hours, and closure dates.
- Conflict-aware booking service with transactional overlap prevention.
- Availability API that surfaces free slots by combining working hours and existing bookings.
- Admin dashboards for CRUD operations and utilization reporting.
- Member interface with booking workflows, availability exploration, and cancellation tools.

## Project Structure

```
app/            # Application logic (models, services, controllers, policies)
config/         # Lightweight configuration for app + booking limits
database/       # Migrations, factories, and seeders
resources/      # Inertia React UI and Blade entry point
routes/         # API and web endpoints
public/         # Web entry point (index.php)
```

## Getting Started

1. **Install PHP dependencies**
   ```bash
   composer install
   ```
2. **Install JavaScript dependencies and build assets**
   ```bash
   npm install
   npm run build # or npm run dev for hot reload
   ```
3. **Copy the environment file and configure credentials**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. **Run database migrations and seeders**
   ```bash
   php artisan migrate --seed
   ```
5. **Start the development servers**
   ```bash
   php artisan serve
   npm run dev
   ```

## Testing

Execute the automated test suite with Pest/PHPUnit:

```bash
php artisan test
```

## Documentation

- [Public kiosk view plan](docs/public-kiosk-view.md) – outlines the architecture and rollout steps for a read-only availability board intended for office displays.

Additional documentation will be added as the project evolves.
