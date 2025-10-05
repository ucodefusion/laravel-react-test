<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\OfficeController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\ReportController;

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::get('/offices', [OfficeController::class, 'index']);
    Route::post('/offices', [OfficeController::class, 'store']);
    Route::get('/offices/{office}', [OfficeController::class, 'show']);
    Route::put('/offices/{office}', [OfficeController::class, 'update']);
    Route::delete('/offices/{office}', [OfficeController::class, 'destroy']);

    Route::get('/rooms', [RoomController::class, 'index']);
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::get('/rooms/{room}', [RoomController::class, 'show']);
    Route::put('/rooms/{room}', [RoomController::class, 'update']);
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);

    Route::get('/rooms/{room}/availability', [AvailabilityController::class, 'show']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);

    Route::get('/reports/utilization', [ReportController::class, 'utilization']);
});
