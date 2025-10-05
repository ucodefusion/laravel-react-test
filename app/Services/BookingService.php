<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Room;
use App\Services\Booking\BookingOverlapGuard;
use App\Services\Booking\BookingValidator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;

class BookingService
{
    public function __construct(
        private readonly BookingValidator $validator,
        private readonly BookingOverlapGuard $overlapGuard,
    ) {
    }

    public function create(
        int $roomId,
        int $userId,
        Carbon $startsAt,
        Carbon $endsAt,
        int $attendeeCount = 1,
        ?string $title = null,
        ?string $notes = null
    ): Booking {
        $room = Room::findOrFail($roomId);
        $this->validator->validate($room, $startsAt, $endsAt, $attendeeCount);

        return DB::transaction(function () use ($room, $userId, $startsAt, $endsAt, $attendeeCount, $title, $notes) {
            $this->overlapGuard->lock($room->id, $startsAt, $endsAt);
            $this->overlapGuard->assertAvailability($room->id, $startsAt, $endsAt);

            $booking = Booking::create([
                'room_id' => $room->id,
                'user_id' => $userId,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'attendee_count' => $attendeeCount,
                'status' => 'confirmed',
                'title' => $title,
                'notes' => $notes,
            ]);

            Event::dispatch('booking.created', $booking);

            return $booking;
        });
    }

    public function update(Booking $booking, array $payload): Booking
    {
        $startsAt = Carbon::parse($payload['starts_at'] ?? $booking->starts_at);
        $endsAt = Carbon::parse($payload['ends_at'] ?? $booking->ends_at);
        $attendeeCount = $payload['attendee_count'] ?? $booking->attendee_count;

        $this->validator->validate($booking->room, $startsAt, $endsAt, $attendeeCount);

        return DB::transaction(function () use ($booking, $payload, $startsAt, $endsAt, $attendeeCount) {
            $this->overlapGuard->lock($booking->room_id, $startsAt, $endsAt, $booking->id);
            $this->overlapGuard->assertAvailability($booking->room_id, $startsAt, $endsAt, $booking->id);

            $booking->fill([
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'attendee_count' => $attendeeCount,
                'title' => $payload['title'] ?? $booking->title,
                'notes' => $payload['notes'] ?? $booking->notes,
            ])->save();

            Event::dispatch('booking.updated', $booking);

            return $booking->refresh();
        });
    }

    public function cancel(Booking $booking): Booking
    {
        $booking->update(['status' => 'cancelled']);
        Event::dispatch('booking.cancelled', $booking);

        return $booking;
    }

}
