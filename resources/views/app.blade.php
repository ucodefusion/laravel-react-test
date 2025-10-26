<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title inertia>{{ config('app.name', 'OfficeBooking') }}</title>
        @viteReactRefresh
        @vite('resources/js/app.jsx')
    </head>
    <body class="font-sans antialiased bg-slate-50">
        @inertia
    </body>
</html>
