<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Members/Dashboard', [
        'upcomingBookings' => [],
    ]);
})->name('dashboard');

Route::get('/rooms', function () {
    return Inertia::render('Members/RoomExplorer', [
        'rooms' => [],
        'filters' => [],
        'amenities' => [],
    ]);
})->name('rooms.index');

Route::get('/bookings', function () {
    return Inertia::render('Members/Bookings', [
        'bookings' => [],
        'rooms' => [],
    ]);
})->name('bookings.index');

Route::prefix('admin')->group(function () {
    Route::get('/rooms', function () {
        return Inertia::render('Admin/Rooms', [
            'rooms' => [],
            'offices' => [],
            'amenities' => [],
        ]);
    })->name('admin.rooms');

    Route::get('/offices', function () {
        return Inertia::render('Admin/Offices', [
            'offices' => [],
        ]);
    })->name('admin.offices');

    Route::get('/reports', function () {
        return Inertia::render('Admin/Reports', [
            'rooms' => [],
            'utilization' => [],
        ]);
    })->name('admin.reports');
});
