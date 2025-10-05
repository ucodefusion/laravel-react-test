<?php

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('bookings cannot overlap', function () {
    $user = User::factory()->create();
    $room = Room::factory()->create();

    Booking::factory()->create([
        'room_id' => $room->id,
        'starts_at' => Carbon::parse('2024-01-01 10:00:00'),
        'ends_at' => Carbon::parse('2024-01-01 11:00:00'),
    ]);

    $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/bookings', [
        'room_id' => $room->id,
        'starts_at' => '2024-01-01 10:30:00',
        'ends_at' => '2024-01-01 11:30:00',
        'attendee_count' => 2,
    ]);

    $response->assertStatus(422);
});
